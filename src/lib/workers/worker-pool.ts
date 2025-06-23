// Worker pool for CPU-intensive divination calculations
import { Worker } from 'worker_threads';
import { resolve } from 'path';

interface WorkerTask<T, R> {
  id: string;
  type: string;
  input: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
  priority: number;
  timestamp: number;
}

interface WorkerPoolOptions {
  minWorkers: number;
  maxWorkers: number;
  maxQueueSize: number;
  workerIdleTimeout: number;
  taskTimeout: number;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private busyWorkers = new Set<Worker>();
  private taskQueue: WorkerTask<any, any>[] = [];
  private taskCounter = 0;
  
  constructor(
    private workerScript: string,
    private options: WorkerPoolOptions = {
      minWorkers: 2,
      maxWorkers: Math.max(2, Math.ceil(4 / 2)), // Fallback to 4 CPUs
      maxQueueSize: 100,
      workerIdleTimeout: 60000, // 1分
      taskTimeout: 30000 // 30秒
    }
  ) {
    this.initializeWorkers();
  }

  /**
   * ワーカー初期化
   */
  private initializeWorkers(): void {
    for (let i = 0; i < this.options.minWorkers; i++) {
      this.createWorker();
    }
  }

  /**
   * ワーカー作成
   */
  private createWorker(): Worker {
    const worker = new Worker(this.workerScript);
    
    worker.on('message', (result) => {
      this.handleWorkerResult(worker, result);
    });

    worker.on('error', (error) => {
      this.handleWorkerError(worker, error);
    });

    worker.on('exit', (code) => {
      this.handleWorkerExit(worker, code);
    });

    this.workers.push(worker);
    this.availableWorkers.push(worker);
    
    return worker;
  }

  /**
   * タスク実行
   */
  async execute<T, R>(type: string, input: T, priority = 0): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const taskId = `task_${++this.taskCounter}`;
      
      const task: WorkerTask<T, R> = {
        id: taskId,
        type,
        input,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      };

      // キューサイズチェック
      if (this.taskQueue.length >= this.options.maxQueueSize) {
        reject(new Error('Task queue is full'));
        return;
      }

      // タスクをキューに追加（優先度順）
      this.taskQueue.push(task);
      this.taskQueue.sort((a, b) => b.priority - a.priority);

      // タスク処理開始
      this.processTasks();

      // タイムアウト設定
      setTimeout(() => {
        const index = this.taskQueue.findIndex(t => t.id === taskId);
        if (index >= 0) {
          this.taskQueue.splice(index, 1);
          reject(new Error('Task timeout'));
        }
      }, this.options.taskTimeout);
    });
  }

  /**
   * タスク処理
   */
  private processTasks(): void {
    while (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const task = this.taskQueue.shift()!;
      const worker = this.availableWorkers.shift()!;
      
      this.busyWorkers.add(worker);
      
      // ワーカーにタスクを送信
      worker.postMessage({
        taskId: task.id,
        type: task.type,
        input: task.input
      });

      // タスクをワーカーと関連付け
      (worker as any).currentTask = task;
    }

    // 必要に応じて新しいワーカーを作成
    if (this.taskQueue.length > 0 && 
        this.workers.length < this.options.maxWorkers && 
        this.availableWorkers.length === 0) {
      this.createWorker();
      this.processTasks(); // 再帰的に処理
    }
  }

  /**
   * ワーカー結果処理
   */
  private handleWorkerResult(worker: Worker, result: any): void {
    const task = (worker as any).currentTask;
    if (task) {
      if (result.error) {
        task.reject(new Error(result.error));
      } else {
        task.resolve(result.data);
      }
      
      (worker as any).currentTask = null;
    }

    // ワーカーを利用可能状態に戻す
    this.busyWorkers.delete(worker);
    this.availableWorkers.push(worker);

    // 次のタスクを処理
    this.processTasks();
  }

  /**
   * ワーカーエラー処理
   */
  private handleWorkerError(worker: Worker, error: Error): void {
    const task = (worker as any).currentTask;
    if (task) {
      task.reject(error);
    }

    // ワーカーを再作成
    this.removeWorker(worker);
    if (this.workers.length < this.options.minWorkers) {
      this.createWorker();
    }
  }

  /**
   * ワーカー終了処理
   */
  private handleWorkerExit(worker: Worker, code: number): void {
    console.warn(`Worker exited with code ${code}`);
    
    const task = (worker as any).currentTask;
    if (task) {
      task.reject(new Error(`Worker exited with code ${code}`));
    }

    this.removeWorker(worker);
    
    // 最小ワーカー数を維持
    if (this.workers.length < this.options.minWorkers) {
      this.createWorker();
    }
  }

  /**
   * ワーカー削除
   */
  private removeWorker(worker: Worker): void {
    const workerIndex = this.workers.indexOf(worker);
    if (workerIndex >= 0) {
      this.workers.splice(workerIndex, 1);
    }

    const availableIndex = this.availableWorkers.indexOf(worker);
    if (availableIndex >= 0) {
      this.availableWorkers.splice(availableIndex, 1);
    }

    this.busyWorkers.delete(worker);
  }

  /**
   * 統計情報取得
   */
  getStats() {
    return {
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.busyWorkers.size,
      queuedTasks: this.taskQueue.length,
      maxQueueSize: this.options.maxQueueSize,
      queueUtilization: (this.taskQueue.length / this.options.maxQueueSize) * 100
    };
  }

  /**
   * ワーカープール終了
   */
  async terminate(): Promise<void> {
    const terminationPromises = this.workers.map(worker => worker.terminate());
    await Promise.all(terminationPromises);
    
    this.workers = [];
    this.availableWorkers = [];
    this.busyWorkers.clear();
    this.taskQueue = [];
  }

  /**
   * ヘルスチェック
   */
  healthCheck(): { healthy: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (this.workers.length === 0) {
      issues.push('No workers available');
    }
    
    if (this.taskQueue.length >= this.options.maxQueueSize * 0.8) {
      issues.push('Task queue is nearly full');
    }
    
    if (this.busyWorkers.size === this.workers.length && this.taskQueue.length > 0) {
      issues.push('All workers are busy and tasks are queued');
    }

    // 古いタスクのチェック
    const now = Date.now();
    const oldTasks = this.taskQueue.filter(task => 
      now - task.timestamp > this.options.taskTimeout * 0.5
    );
    
    if (oldTasks.length > 0) {
      issues.push(`${oldTasks.length} tasks are taking longer than expected`);
    }

    return {
      healthy: issues.length === 0,
      issues
    };
  }
}

// 特化されたワーカープール（占術計算用）
export class DivinationWorkerPool extends WorkerPool {
  constructor() {
    super(resolve(__dirname, 'divination-worker.js'), {
      minWorkers: 1,
      maxWorkers: 4,
      maxQueueSize: 50,
      workerIdleTimeout: 120000, // 2分
      taskTimeout: 60000 // 1分
    });
  }

  /**
   * 数秘術計算
   */
  async calculateNumerology(input: any): Promise<any> {
    return this.execute('numerology', input, 1);
  }

  /**
   * 複雑な占星術計算
   */
  async calculateAstrology(input: any): Promise<any> {
    return this.execute('astrology', input, 2);
  }

  /**
   * 統合占術計算
   */
  async calculateIntegrated(input: any): Promise<any> {
    return this.execute('integrated', input, 3);
  }
}

// シングルトンインスタンス
export const divinationWorkerPool = new DivinationWorkerPool();