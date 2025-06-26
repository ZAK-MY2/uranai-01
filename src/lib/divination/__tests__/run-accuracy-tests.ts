/**
 * 精度テスト実行スクリプト
 * 
 * コマンドラインから実行可能な精度テストランナー
 */

import { runFullAccuracyTestSuite } from './accuracy-test-suite';
import { table } from 'table';
import chalk from 'chalk';

async function main() {
  console.log(chalk.blue.bold('\n🔍 占術エンジン精度検証テストを開始します...\n'));

  const startTime = Date.now();
  
  try {
    const { results, summary } = await runFullAccuracyTestSuite();
    
    // サマリー表示
    console.log(chalk.yellow.bold('\n📊 テスト結果サマリー'));
    console.log(chalk.white(`総エンジン数: ${summary.totalEngines}`));
    console.log(chalk.green(`✅ 合格: ${summary.passed}`));
    console.log(chalk.red(`❌ 不合格: ${summary.failed}`));
    console.log(chalk.cyan(`平均スコア: ${summary.averageScore.toFixed(1)}%\n`));

    // 詳細結果のテーブル表示
    const tableData = [
      ['エンジン名', '一貫性', '範囲検証', 'データ整合性', 'パフォーマンス', 'スコア', '結果']
    ];

    for (const result of results) {
      const row = [
        result.engineName,
        result.tests.consistency.passed ? '✅' : '❌',
        result.tests.rangeValidation.passed ? '✅' : '❌',
        result.tests.dataIntegrity.passed ? '✅' : '❌',
        result.tests.performance.passed ? '✅' : '❌',
        `${result.overallScore.toFixed(0)}%`,
        result.passed ? chalk.green('合格') : chalk.red('不合格')
      ];
      tableData.push(row);
    }

    console.log(table(tableData, {
      header: {
        alignment: 'center',
        content: chalk.yellow.bold('詳細テスト結果')
      }
    }));

    // 問題の詳細表示
    console.log(chalk.yellow.bold('\n📋 詳細レポート\n'));
    
    for (const result of results) {
      if (!result.passed) {
        console.log(chalk.red.bold(`\n${result.engineName} の問題:`));
        
        if (!result.tests.consistency.passed) {
          console.log(chalk.red(`  - 一貫性: ${result.tests.consistency.message}`));
        }
        
        if (!result.tests.rangeValidation.passed) {
          console.log(chalk.red(`  - 範囲エラー: ${result.tests.rangeValidation.outOfRangeFields.join(', ')}`));
        }
        
        if (!result.tests.dataIntegrity.passed) {
          if (result.tests.dataIntegrity.missingFields.length > 0) {
            console.log(chalk.red(`  - 欠落フィールド: ${result.tests.dataIntegrity.missingFields.join(', ')}`));
          }
          if (result.tests.dataIntegrity.invalidFields.length > 0) {
            console.log(chalk.red(`  - 無効フィールド: ${result.tests.dataIntegrity.invalidFields.join(', ')}`));
          }
        }
        
        if (!result.tests.performance.passed) {
          console.log(chalk.red(`  - パフォーマンス: 平均${result.tests.performance.averageTime}ms, 最大${result.tests.performance.maxTime}ms`));
        }
      }
    }

    // パフォーマンス詳細
    console.log(chalk.cyan.bold('\n⚡ パフォーマンス詳細\n'));
    
    for (const result of results) {
      const perf = result.tests.performance;
      const perfStatus = perf.passed ? chalk.green('OK') : chalk.red('NG');
      console.log(`${result.engineName}: 平均 ${perf.averageTime.toFixed(0)}ms, 最大 ${perf.maxTime.toFixed(0)}ms [${perfStatus}]`);
    }

    const totalTime = Date.now() - startTime;
    console.log(chalk.blue.bold(`\n✨ テスト完了！ 総実行時間: ${(totalTime / 1000).toFixed(1)}秒\n`));

    // 終了コード
    process.exit(summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ テスト実行中にエラーが発生しました:'));
    console.error(error);
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  main();
}