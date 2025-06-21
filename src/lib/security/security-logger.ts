// Security event logging and monitoring
interface SecurityEvent {
  type: SecurityEventType;
  ip: string;
  path?: string;
  method?: string;
  userId?: string;
  userAgent?: string;
  error?: string;
  details?: Record<string, any>;
  timestamp: Date;
  limit?: number;
  window?: number;
  // 任意の追加プロパティを許可
  [key: string]: any;
}

type SecurityEventType = 
  | 'unauthorized_access'
  | 'rate_limit_exceeded'
  | 'csrf_violation'
  | 'xss_attempt'
  | 'sql_injection_attempt'
  | 'path_traversal_attempt'
  | 'malicious_payload'
  | 'suspicious_behavior'
  | 'brute_force_attempt'
  | 'ip_blocked'
  | 'auth_error'
  | 'insufficient_permissions'
  | 'sensitive_endpoint_access'
  | 'data_export'
  | 'admin_action'
  | 'security_error'
  | 'middleware_error';

interface SecurityAlert {
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  events: SecurityEvent[];
  timestamp: Date;
}

interface ThreatDetectionRule {
  name: string;
  description: string;
  eventTypes: SecurityEventType[];
  threshold: number;
  timeWindow: number; // minutes
  severity: SecurityAlert['level'];
  enabled: boolean;
}

export class SecurityLogger {
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private maxEvents = 10000; // メモリ内保持する最大イベント数
  private maxAlerts = 1000; // メモリ内保持する最大アラート数

  // 脅威検知ルール
  private threatRules: ThreatDetectionRule[] = [
    {
      name: 'brute_force_detection',
      description: '同一IPからの連続認証失敗',
      eventTypes: ['unauthorized_access', 'auth_error'],
      threshold: 5,
      timeWindow: 5,
      severity: 'high',
      enabled: true
    },
    {
      name: 'rate_limit_abuse',
      description: 'レート制限の頻繁な違反',
      eventTypes: ['rate_limit_exceeded'],
      threshold: 10,
      timeWindow: 10,
      severity: 'medium',
      enabled: true
    },
    {
      name: 'injection_attempts',
      description: 'インジェクション攻撃の検知',
      eventTypes: ['sql_injection_attempt', 'xss_attempt'],
      threshold: 1,
      timeWindow: 1,
      severity: 'critical',
      enabled: true
    },
    {
      name: 'suspicious_access_pattern',
      description: '不審なアクセスパターン',
      eventTypes: ['suspicious_behavior', 'path_traversal_attempt'],
      threshold: 3,
      timeWindow: 15,
      severity: 'medium',
      enabled: true
    },
    {
      name: 'admin_abuse',
      description: '管理者権限の乱用',
      eventTypes: ['admin_action', 'sensitive_endpoint_access'],
      threshold: 20,
      timeWindow: 60,
      severity: 'high',
      enabled: true
    }
  ];

  /**
   * セキュリティイベントをログ
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // イベントを配列に追加
      this.events.push(event);

      // メモリ制限チェック
      if (this.events.length > this.maxEvents) {
        this.events = this.events.slice(-this.maxEvents);
      }

      // コンソールログ
      this.logToConsole(event);

      // データベースに保存（実装例）
      await this.saveToDatabase(event);

      // 脅威検知
      await this.detectThreats(event);

      // 外部監視システムに送信（本番環境）
      if (process.env.NODE_ENV === 'production') {
        await this.sendToExternalMonitoring(event);
      }

    } catch (error) {
      console.error('Security logging error:', error);
    }
  }

  /**
   * コンソールログ出力
   */
  private logToConsole(event: SecurityEvent): void {
    const logLevel = this.getLogLevel(event.type);
    const logMessage = `[SECURITY-${event.type.toUpperCase()}] ${event.ip} - ${event.path || 'N/A'}`;

    switch (logLevel) {
      case 'error':
        console.error(logMessage, event);
        break;
      case 'warn':
        console.warn(logMessage, event);
        break;
      default:
        console.log(logMessage, event);
    }
  }

  /**
   * データベース保存
   */
  private async saveToDatabase(event: SecurityEvent): Promise<void> {
    try {
      // Supabaseクライアントを使用してセキュリティログテーブルに保存
      // 実際の実装では適切なデータベース接続を使用
      
      // プレースホルダー実装
      const logData = {
        event_type: event.type,
        ip_address: event.ip,
        path: event.path,
        method: event.method,
        user_id: event.userId,
        user_agent: event.userAgent,
        error_message: event.error,
        details: event.details,
        created_at: event.timestamp.toISOString()
      };

      // 本来はここでSupabaseまたは他のデータベースに保存
      console.log('Security event saved to database:', logData);

    } catch (error) {
      console.error('Failed to save security event to database:', error);
    }
  }

  /**
   * 脅威検知
   */
  private async detectThreats(currentEvent: SecurityEvent): Promise<void> {
    const now = Date.now();

    for (const rule of this.threatRules) {
      if (!rule.enabled || !rule.eventTypes.includes(currentEvent.type)) {
        continue;
      }

      // 時間窓内のイベントを取得
      const windowStart = now - (rule.timeWindow * 60 * 1000);
      const relevantEvents = this.events.filter(event => 
        rule.eventTypes.includes(event.type) &&
        event.ip === currentEvent.ip &&
        event.timestamp.getTime() >= windowStart
      );

      // 閾値チェック
      if (relevantEvents.length >= rule.threshold) {
        await this.createAlert({
          level: rule.severity,
          message: `${rule.description}: IP ${currentEvent.ip} (${relevantEvents.length} events in ${rule.timeWindow} minutes)`,
          events: relevantEvents,
          timestamp: new Date()
        });

        // 自動対応（必要に応じて）
        await this.autoRespond(rule, currentEvent, relevantEvents);
      }
    }
  }

  /**
   * アラート作成
   */
  private async createAlert(alert: SecurityAlert): Promise<void> {
    this.alerts.push(alert);

    // メモリ制限チェック
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }

    // 重要度に応じた通知
    switch (alert.level) {
      case 'critical':
        console.error('[CRITICAL SECURITY ALERT]', alert.message);
        await this.sendImmediateNotification(alert);
        break;
      case 'high':
        console.warn('[HIGH SECURITY ALERT]', alert.message);
        await this.sendNotification(alert);
        break;
      case 'medium':
        console.warn('[MEDIUM SECURITY ALERT]', alert.message);
        break;
      case 'low':
        console.log('[LOW SECURITY ALERT]', alert.message);
        break;
    }

    // アラートをデータベースに保存
    await this.saveAlertToDatabase(alert);
  }

  /**
   * 自動対応
   */
  private async autoRespond(
    rule: ThreatDetectionRule,
    event: SecurityEvent,
    events: SecurityEvent[]
  ): Promise<void> {
    try {
      switch (rule.name) {
        case 'brute_force_detection':
          // 一時的なIP禁止
          await this.temporaryIPBan(event.ip, 30); // 30分間
          break;
          
        case 'injection_attempts':
          // 即座にIP禁止
          await this.temporaryIPBan(event.ip, 60 * 24); // 24時間
          break;
          
        case 'rate_limit_abuse':
          // レート制限を強化
          await this.increaseSteadyRateLimit(event.ip);
          break;
      }
    } catch (error) {
      console.error('Auto-response error:', error);
    }
  }

  /**
   * 一時的IP禁止
   */
  private async temporaryIPBan(ip: string, minutes: number): Promise<void> {
    console.log(`Temporarily banning IP ${ip} for ${minutes} minutes`);
    
    // 実際の実装では、IP禁止リストに追加
    // Redis、データベース、またはメモリキャッシュを使用
    
    // 禁止解除のタイマー設定
    setTimeout(() => {
      console.log(`IP ban lifted for ${ip}`);
    }, minutes * 60 * 1000);
  }

  /**
   * レート制限強化
   */
  private async increaseSteadyRateLimit(ip: string): Promise<void> {
    console.log(`Increasing rate limit for IP ${ip}`);
    // 実装: 該当IPのレート制限を一時的に厳しくする
  }

  /**
   * 外部監視システムへの送信
   */
  private async sendToExternalMonitoring(event: SecurityEvent): Promise<void> {
    try {
      // Slack、Discord、PagerDuty、Datadog等への送信
      // 環境変数から設定を取得して適切なサービスに送信
      
      if (process.env.SECURITY_WEBHOOK_URL) {
        await fetch(process.env.SECURITY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `Security Event: ${event.type}`,
            attachments: [{
              color: 'warning',
              fields: [
                { title: 'IP', value: event.ip, short: true },
                { title: 'Path', value: event.path || 'N/A', short: true },
                { title: 'User ID', value: event.userId || 'N/A', short: true },
                { title: 'Timestamp', value: event.timestamp.toISOString(), short: true }
              ]
            }]
          })
        });
      }
    } catch (error) {
      console.error('Failed to send to external monitoring:', error);
    }
  }

  /**
   * 即座の通知送信
   */
  private async sendImmediateNotification(alert: SecurityAlert): Promise<void> {
    // 緊急通知の実装（SMS、電話、重要なSlackチャンネル等）
    console.log('IMMEDIATE NOTIFICATION REQUIRED:', alert);
  }

  /**
   * 通知送信
   */
  private async sendNotification(alert: SecurityAlert): Promise<void> {
    // 標準通知の実装
    console.log('Security notification sent:', alert);
  }

  /**
   * アラートをデータベースに保存
   */
  private async saveAlertToDatabase(alert: SecurityAlert): Promise<void> {
    try {
      const alertData = {
        level: alert.level,
        message: alert.message,
        event_count: alert.events.length,
        first_event_time: alert.events[0]?.timestamp.toISOString(),
        last_event_time: alert.events[alert.events.length - 1]?.timestamp.toISOString(),
        affected_ips: [...new Set(alert.events.map(e => e.ip))],
        created_at: alert.timestamp.toISOString()
      };

      console.log('Security alert saved to database:', alertData);
    } catch (error) {
      console.error('Failed to save security alert to database:', error);
    }
  }

  /**
   * ログレベル取得
   */
  private getLogLevel(eventType: SecurityEventType): 'log' | 'warn' | 'error' {
    const criticalEvents: SecurityEventType[] = [
      'sql_injection_attempt',
      'xss_attempt',
      'brute_force_attempt'
    ];

    const warningEvents: SecurityEventType[] = [
      'rate_limit_exceeded',
      'csrf_violation',
      'unauthorized_access',
      'suspicious_behavior'
    ];

    if (criticalEvents.includes(eventType)) return 'error';
    if (warningEvents.includes(eventType)) return 'warn';
    return 'log';
  }

  /**
   * 統計情報取得
   */
  getStats(timeWindow?: number): {
    totalEvents: number;
    totalAlerts: number;
    eventsByType: Record<SecurityEventType, number>;
    topIPs: Array<{ ip: string; count: number }>;
    recentAlerts: SecurityAlert[];
  } {
    const now = Date.now();
    const windowStart = timeWindow ? now - (timeWindow * 60 * 1000) : 0;
    
    const relevantEvents = this.events.filter(event => 
      event.timestamp.getTime() >= windowStart
    );

    // イベントタイプ別集計
    const eventsByType = relevantEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEventType, number>);

    // IP別集計
    const ipCounts = relevantEvents.reduce((acc, event) => {
      acc[event.ip] = (acc[event.ip] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents: relevantEvents.length,
      totalAlerts: this.alerts.length,
      eventsByType,
      topIPs,
      recentAlerts: this.alerts.slice(-10)
    };
  }

  /**
   * イベント検索
   */
  searchEvents(criteria: {
    ip?: string;
    userId?: string;
    eventType?: SecurityEventType;
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): SecurityEvent[] {
    let filtered = [...this.events];

    if (criteria.ip) {
      filtered = filtered.filter(event => event.ip === criteria.ip);
    }

    if (criteria.userId) {
      filtered = filtered.filter(event => event.userId === criteria.userId);
    }

    if (criteria.eventType) {
      filtered = filtered.filter(event => event.type === criteria.eventType);
    }

    if (criteria.timeRange) {
      filtered = filtered.filter(event => 
        event.timestamp >= criteria.timeRange!.start &&
        event.timestamp <= criteria.timeRange!.end
      );
    }

    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, criteria.limit || 100);
  }
}

// シングルトンインスタンス
export const securityLogger = new SecurityLogger();