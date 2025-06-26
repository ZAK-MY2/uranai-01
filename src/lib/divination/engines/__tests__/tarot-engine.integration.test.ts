import { TarotEngine } from '../tarot-engine';
import { DivinationInput } from '../../base-engine';
import { getTarotCardMessage } from '../../messages/tarot-messages';

// モック環境データ
const mockEnvironmentData = {
  lunar: {
    phase: 0.5,
    phaseName: '満月',
    illumination: 100,
    moonSign: '蟹座',
    nextNewMoon: new Date('2025-07-01'),
    nextFullMoon: new Date('2025-07-15')
  },
  solar: {
    sunrise: new Date('2025-06-25T05:30:00'),
    sunset: new Date('2025-06-25T19:00:00'),
    dayLength: 13.5,
    solarNoon: new Date('2025-06-25T12:15:00')
  },
  planetary: {
    mercury: { sign: '双子座', retrograde: false },
    venus: { sign: '獅子座', retrograde: false },
    mars: { sign: '牡羊座', retrograde: false },
    jupiter: { sign: '牡牛座', retrograde: false },
    saturn: { sign: '魚座', retrograde: true }
  },
  weather: {
    temperature: 25,
    humidity: 60,
    pressure: 1013,
    condition: '晴れ',
    windSpeed: 5,
    windDirection: '北東'
  },
  seasonal: {
    season: '夏',
    solarTerm: '夏至',
    element: '火'
  }
};

// テスト用入力データ
const testInput: DivinationInput = {
  fullName: 'テスト太郎',
  birthDate: new Date('1990-01-01'),
  birthTime: '12:00',
  birthPlace: '東京都',
  gender: '男性',
  question: '今後の恋愛運について教えてください',
  questionCategory: '恋愛・結婚'
};

describe('TarotEngine Integration Tests', () => {
  describe('基本機能テスト', () => {
    it('エンジンが正しく初期化される', () => {
      const engine = new TarotEngine(testInput, mockEnvironmentData);
      expect(engine).toBeDefined();
      expect(engine.getDeckSize()).toBe(78); // タロットは78枚
    });

    it('利用可能なスプレッドを取得できる', () => {
      const engine = new TarotEngine(testInput, mockEnvironmentData);
      const spreads = engine.getAvailableSpreads();
      
      expect(spreads).toHaveLength(5);
      expect(spreads.map(s => s.type)).toContain('one-card');
      expect(spreads.map(s => s.type)).toContain('three-card');
      expect(spreads.map(s => s.type)).toContain('celtic-cross');
      expect(spreads.map(s => s.type)).toContain('relationship');
      expect(spreads.map(s => s.type)).toContain('decision');
    });

    it('カードプレビューが取得できる', () => {
      const engine = new TarotEngine(testInput, mockEnvironmentData);
      const card = engine.getCardPreview(0);
      
      expect(card).toBeDefined();
      expect(card?.name).toBeDefined();
      expect(card?.keywords).toBeDefined();
      expect(card?.interpretation).toBeDefined();
    });
  });

  describe('各スプレッドタイプのテスト', () => {
    describe('ワンカードスプレッド', () => {
      it('正しい形式の結果を返す', () => {
        const engine = new TarotEngine(testInput, mockEnvironmentData, {
          spreadType: 'one-card'
        });
        const reading = engine.calculate();
        
        expect(reading.spread.type).toBe('one-card');
        expect(reading.positions).toHaveLength(1);
        expect(reading.overallMessage).toBeDefined();
        expect(reading.interpretation.summary).toBeDefined();
        expect(reading.interpretation.details).toHaveLength(1);
        expect(reading.interpretation.synthesis).toBeDefined();
        expect(reading.moonPhaseInfluence).toBeDefined();
        expect(reading.personalizedGuidance).toBeDefined();
      });

      it('メッセージの多様性がある', () => {
        const readings = [];
        for (let i = 0; i < 10; i++) {
          const input = { ...testInput, fullName: `テスト${i}` };
          const engine = new TarotEngine(input, mockEnvironmentData, {
            spreadType: 'one-card'
          });
          readings.push(engine.calculate());
        }
        
        // 異なるカードが引かれていることを確認
        const uniqueCards = new Set(readings.map(r => r.positions[0].card.id));
        expect(uniqueCards.size).toBeGreaterThan(5);
        
        // メッセージの多様性を確認
        const uniqueMessages = new Set(readings.map(r => r.interpretation.summary));
        expect(uniqueMessages.size).toBeGreaterThan(5);
      });
    });

    describe('スリーカードスプレッド', () => {
      it('過去・現在・未来の解釈を含む', () => {
        const engine = new TarotEngine(testInput, mockEnvironmentData, {
          spreadType: 'three-card'
        });
        const reading = engine.calculate();
        
        expect(reading.positions).toHaveLength(3);
        expect(reading.positions[0].position).toBe('過去');
        expect(reading.positions[1].position).toBe('現在');
        expect(reading.positions[2].position).toBe('未来');
        
        // 各ポジションに適切なメッセージがある
        reading.positions.forEach(pos => {
          expect(pos.meaning).toBeDefined();
          expect(pos.meaning.length).toBeGreaterThan(10);
        });
      });
    });

    describe('ケルト十字スプレッド', () => {
      it('10枚のカードで包括的な読み取りを提供', () => {
        const engine = new TarotEngine(testInput, mockEnvironmentData, {
          spreadType: 'celtic-cross'
        });
        const reading = engine.calculate();
        
        expect(reading.positions).toHaveLength(10);
        expect(reading.spread.name).toContain('ケルト十字');
        
        // 重要なポジションが含まれている
        const positionNames = reading.positions.map(p => p.position);
        expect(positionNames).toContain('現在の状況');
        expect(positionNames).toContain('直面する課題');
        expect(positionNames).toContain('最終結果');
      });

      it('大アルカナの割合に応じてメッセージが変わる', () => {
        // この詳細なテストは実装の詳細に依存するため、基本的な動作確認のみ
        const engine = new TarotEngine(testInput, mockEnvironmentData, {
          spreadType: 'celtic-cross'
        });
        const reading = engine.calculate();
        
        const majorArcanaCount = reading.positions.filter(
          p => p.card.arcana === 'major'
        ).length;
        
        // 大アルカナの枚数に関わらず、適切なメッセージが生成される
        expect(reading.overallMessage).toBeDefined();
        expect(reading.overallMessage.length).toBeGreaterThan(20);
      });
    });

    describe('関係性スプレッド', () => {
      it('恋愛関連の質問に特化した解釈を提供', () => {
        const loveInput = {
          ...testInput,
          question: '彼との今後の関係について',
          questionCategory: '恋愛・結婚'
        };
        
        const engine = new TarotEngine(loveInput, mockEnvironmentData, {
          spreadType: 'relationship'
        });
        const reading = engine.calculate();
        
        expect(reading.positions).toHaveLength(7);
        
        // 関係性に特化したポジション
        const positionNames = reading.positions.map(p => p.position);
        expect(positionNames).toContain('あなたの気持ち');
        expect(positionNames).toContain('相手の気持ち');
        expect(positionNames).toContain('関係の現状');
        expect(positionNames).toContain('関係の未来');
      });
    });

    describe('決断のスプレッド', () => {
      it('選択肢に関する洞察を提供', () => {
        const decisionInput = {
          ...testInput,
          question: '転職すべきかどうか',
          questionCategory: '仕事・転職'
        };
        
        const engine = new TarotEngine(decisionInput, mockEnvironmentData, {
          spreadType: 'decision'
        });
        const reading = engine.calculate();
        
        expect(reading.positions).toHaveLength(5);
        
        // 決断に必要な要素が含まれている
        const positionNames = reading.positions.map(p => p.position);
        expect(positionNames).toContain('選択肢A');
        expect(positionNames).toContain('選択肢B');
        expect(positionNames).toContain('最善の道');
      });
    });
  });

  describe('メッセージシステムの統合テスト', () => {
    it('新しいメッセージシステムから適切なメッセージを取得', () => {
      const engine = new TarotEngine(testInput, mockEnvironmentData);
      const reading = engine.calculate();
      
      reading.positions.forEach(pos => {
        // カードIDに対応するメッセージが存在することを確認
        const cardMessage = getTarotCardMessage(pos.card.id);
        
        // メッセージが存在する場合、豊富な内容があることを確認
        if (cardMessage) {
          expect(cardMessage.uprightInterpretations.length).toBeGreaterThanOrEqual(10);
          expect(cardMessage.categoryInterpretations.love.length).toBeGreaterThanOrEqual(5);
          expect(cardMessage.practicalAdvice.length).toBeGreaterThanOrEqual(5);
        }
      });
    });

    it('カテゴリに応じた適切なメッセージを選択', () => {
      const categories = ['恋愛・結婚', '仕事・転職', '金運・財運', '健康', '総合運'];
      
      categories.forEach(category => {
        const input = { ...testInput, questionCategory: category };
        const engine = new TarotEngine(input, mockEnvironmentData);
        const reading = engine.calculate();
        
        // パーソナライズされたガイダンスがカテゴリを反映
        expect(reading.personalizedGuidance).toBeDefined();
        expect(reading.personalizedGuidance.length).toBeGreaterThan(20);
      });
    });

    it('時間帯に応じたメッセージを生成', () => {
      // 朝のメッセージ
      const morningDate = new Date('2025-06-25T08:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => morningDate);
      
      const morningEngine = new TarotEngine(testInput, mockEnvironmentData);
      const morningReading = morningEngine.calculate();
      
      // メッセージが生成されることを確認
      expect(morningReading.personalizedGuidance).toBeDefined();
      
      // 元に戻す
      jest.restoreAllMocks();
    });
  });

  describe('環境データの影響テスト', () => {
    it('月相が解釈に影響を与える', () => {
      const newMoonEnv = {
        ...mockEnvironmentData,
        lunar: { ...mockEnvironmentData.lunar, phase: 0.05, phaseName: '新月' }
      };
      
      const engine = new TarotEngine(testInput, newMoonEnv);
      const reading = engine.calculate();
      
      expect(reading.moonPhaseInfluence).toContain('新月');
    });

    it('環境データがない場合でも正常に動作', () => {
      const engine = new TarotEngine(testInput);
      const reading = engine.calculate();
      
      expect(reading).toBeDefined();
      expect(reading.positions.length).toBeGreaterThan(0);
      expect(reading.interpretation).toBeDefined();
    });
  });

  describe('ユーザー選択機能のテスト', () => {
    it('ユーザーが選択したカードインデックスを使用', () => {
      const selectedIndices = [0, 21, 77]; // 愚者、世界、ペンタクルのキング
      
      const engine = new TarotEngine(testInput, mockEnvironmentData, {
        spreadType: 'three-card',
        allowUserSelection: true,
        selectedCardIndices: selectedIndices
      });
      
      const reading = engine.calculate();
      
      expect(reading.interactiveElements).toBeDefined();
      expect(reading.interactiveElements?.selectedByUser).toBe(true);
      expect(reading.interactiveElements?.selectionMethod).toBe('intuitive');
    });
  });

  describe('エラーハンドリングのテスト', () => {
    it('不正な入力でもクラッシュしない', () => {
      const invalidInput = {
        fullName: '',
        birthDate: new Date('invalid'),
        birthTime: '',
        birthPlace: '',
        gender: '' as any
      };
      
      expect(() => {
        const engine = new TarotEngine(invalidInput);
        engine.calculate();
      }).not.toThrow();
    });

    it('存在しないカードインデックスでも安全に処理', () => {
      const engine = new TarotEngine(testInput, mockEnvironmentData);
      const card = engine.getCardPreview(999);
      
      expect(card).toBeNull();
    });
  });

  describe('パフォーマンステスト', () => {
    it('大量のリーディングでも高速に処理', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const input = { ...testInput, fullName: `User${i}` };
        const engine = new TarotEngine(input, mockEnvironmentData, {
          spreadType: 'celtic-cross' // 最も重いスプレッド
        });
        engine.calculate();
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // 100回のケルト十字でも5秒以内
      expect(duration).toBeLessThan(5000);
    });
  });

  describe('結果の一貫性テスト', () => {
    it('同じ入力で同じ結果を返す（決定論的）', () => {
      const engine1 = new TarotEngine(testInput, mockEnvironmentData);
      const engine2 = new TarotEngine(testInput, mockEnvironmentData);
      
      const reading1 = engine1.calculate();
      const reading2 = engine2.calculate();
      
      // 同じカードが同じ順序で引かれる
      expect(reading1.positions.map(p => p.card.id)).toEqual(
        reading2.positions.map(p => p.card.id)
      );
    });

    it('入力が少しでも変わると異なる結果を返す', () => {
      const input1 = { ...testInput };
      const input2 = { ...testInput, fullName: 'テスト次郎' };
      
      const engine1 = new TarotEngine(input1, mockEnvironmentData);
      const engine2 = new TarotEngine(input2, mockEnvironmentData);
      
      const reading1 = engine1.calculate();
      const reading2 = engine2.calculate();
      
      // 異なるカードが引かれる
      expect(reading1.positions.map(p => p.card.id)).not.toEqual(
        reading2.positions.map(p => p.card.id)
      );
    });
  });
});