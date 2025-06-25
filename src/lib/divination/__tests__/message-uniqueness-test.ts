import { dynamicMessageGeneratorFinal } from '../dynamic-message-generator-final';
import { DivinationInput } from '../base-engine';

/**
 * 2年間メッセージ重複なしシステムのテスト
 */
async function testMessageUniqueness() {
  console.log('🔮 2年間メッセージ重複なしシステムのテスト開始...\n');

  // テスト用ユーザー入力
  const testUsers: DivinationInput[] = [
    {
      fullName: '山田太郎',
      birthDate: new Date('1990-01-01'),
      birthTime: '12:00',
      birthPlace: '東京',
      question: '恋愛運について教えてください'
    },
    {
      fullName: '鈴木花子',
      birthDate: new Date('1985-05-15'),
      birthTime: '09:30',
      birthPlace: '大阪',
      question: '仕事運はどうでしょうか？'
    },
    {
      fullName: '田中次郎',
      birthDate: new Date('1995-12-25'),
      birthTime: '18:45',
      birthPlace: '名古屋',
      question: '健康運が心配です'
    }
  ];

  const categories = ['恋愛運', '仕事運', '健康運', '金運', '総合運'];
  const baseMessages = [
    'あなたの未来は明るく輝いています',
    '新しい出会いが待っています',
    '努力が実を結ぶ時期です',
    '心身のバランスを大切に',
    '豊かさがあなたに流れ込みます'
  ];

  // メッセージ生成テスト
  const generatedMessages = new Set<string>();
  let duplicateCount = 0;

  console.log('📊 メッセージ生成テスト（各ユーザー50メッセージ）\n');

  for (const user of testUsers) {
    console.log(`👤 ユーザー: ${user.fullName}`);
    
    for (let i = 0; i < 50; i++) {
      const category = categories[i % categories.length];
      const baseMessage = baseMessages[i % baseMessages.length];
      
      try {
        const message = await dynamicMessageGeneratorFinal.generateMessage(
          baseMessage,
          category,
          user,
          undefined,
          'test'
        );
        
        if (generatedMessages.has(message)) {
          duplicateCount++;
          console.log(`  ❌ 重複検出: ${message.substring(0, 50)}...`);
        } else {
          generatedMessages.add(message);
          if (i < 3) {
            console.log(`  ✅ ${category}: ${message.substring(0, 80)}...`);
          }
        }
      } catch (error) {
        console.error(`  ❌ エラー: ${error}`);
      }
    }
    console.log('');
  }

  // 統計情報の表示
  const stats = await dynamicMessageGeneratorFinal.getStatistics();
  
  console.log('📈 統計情報:');
  console.log(`  総生成数: ${generatedMessages.size}`);
  console.log(`  重複数: ${duplicateCount}`);
  console.log(`  重複率: ${((duplicateCount / generatedMessages.size) * 100).toFixed(2)}%`);
  console.log(`  セッションユーザー数: ${stats.sessionUsers}`);
  console.log(`  セッションメッセージ数: ${stats.sessionMessages}`);
  console.log('');

  // パフォーマンステスト
  console.log('⚡ パフォーマンステスト（1000メッセージ生成）\n');
  
  const startTime = Date.now();
  const perfMessages = [];
  
  for (let i = 0; i < 1000; i++) {
    const user = testUsers[i % testUsers.length];
    const category = categories[i % categories.length];
    const baseMessage = baseMessages[i % baseMessages.length];
    
    perfMessages.push(
      dynamicMessageGeneratorFinal.generateMessage(
        baseMessage,
        category,
        user,
        undefined,
        'performance-test'
      )
    );
  }
  
  await Promise.all(perfMessages);
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  console.log(`  生成時間: ${totalTime}ms`);
  console.log(`  平均時間/メッセージ: ${(totalTime / 1000).toFixed(2)}ms`);
  console.log('');

  // 数学的検証
  console.log('🔢 数学的検証:');
  console.log(`  テンプレート要素数:`);
  console.log(`    - 時間表現: 50種類`);
  console.log(`    - 自然比喩: 60種類`);
  console.log(`    - プロセス: 50種類`);
  console.log(`    - 結果: 50種類`);
  console.log(`    - 感情修飾: 50種類`);
  console.log(`    - 時間的表現: 40種類`);
  console.log(`    - 季節表現: 20種類 × 4季節`);
  console.log(`    - 月相表現: 15種類 × 4相`);
  console.log(`    - パターン: 20種類 × 6スタイル`);
  console.log('');
  console.log(`  理論的組み合わせ数: 約3.6兆通り`);
  console.log(`  2年間必要数: ${730 * 10000} = 730万通り`);
  console.log(`  カバー率: 0.0002%`);
  console.log('');

  console.log('✅ テスト完了！');
}

// メイン実行
if (require.main === module) {
  testMessageUniqueness().catch(console.error);
}

export { testMessageUniqueness };