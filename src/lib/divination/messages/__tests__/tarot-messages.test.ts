import { 
  getTarotCardMessage, 
  selectTarotMessage, 
  getCombinationMessage,
  MAJOR_ARCANA_MESSAGES,
  WANDS_MESSAGES,
  ALL_TAROT_MESSAGES
} from '../tarot-messages';

describe('Tarot Messages System', () => {
  describe('getTarotCardMessage', () => {
    it('主要なカードのメッセージを取得できる', () => {
      const foolMessage = getTarotCardMessage('the-fool');
      expect(foolMessage).toBeDefined();
      expect(foolMessage?.uprightInterpretations).toBeDefined();
      expect(foolMessage?.uprightInterpretations.length).toBeGreaterThanOrEqual(10);
    });

    it('存在しないカードIDの場合はnullを返す', () => {
      const message = getTarotCardMessage('non-existent-card');
      expect(message).toBeNull();
    });

    it('すべてのメッセージカテゴリが完備されている', () => {
      const message = getTarotCardMessage('the-magician');
      expect(message).toBeDefined();
      
      if (message) {
        // 基本解釈
        expect(message.uprightInterpretations).toBeDefined();
        expect(message.reversedInterpretations).toBeDefined();
        
        // 位置別解釈
        expect(message.positionInterpretations).toBeDefined();
        expect(message.positionInterpretations.past).toBeDefined();
        expect(message.positionInterpretations.present).toBeDefined();
        expect(message.positionInterpretations.future).toBeDefined();
        
        // カテゴリ別解釈
        expect(message.categoryInterpretations).toBeDefined();
        expect(message.categoryInterpretations.love).toBeDefined();
        expect(message.categoryInterpretations.career).toBeDefined();
        expect(message.categoryInterpretations.health).toBeDefined();
        
        // その他
        expect(message.timingMessages).toBeDefined();
        expect(message.poeticExpressions).toBeDefined();
        expect(message.psychologicalInsights).toBeDefined();
        expect(message.practicalAdvice).toBeDefined();
      }
    });
  });

  describe('selectTarotMessage', () => {
    it('正位置の解釈を取得できる', () => {
      const message = selectTarotMessage('the-fool', 'uprightInterpretations', 0);
      expect(message).toBeDefined();
      expect(message.length).toBeGreaterThan(20);
    });

    it('逆位置の解釈を取得できる', () => {
      const message = selectTarotMessage('the-fool', 'reversedInterpretations', 0);
      expect(message).toBeDefined();
      expect(message.length).toBeGreaterThan(20);
    });

    it('位置別の解釈を取得できる', () => {
      const pastMessage = selectTarotMessage('the-fool', 'positionInterpretations', 0, 'past');
      const presentMessage = selectTarotMessage('the-fool', 'positionInterpretations', 0, 'present');
      const futureMessage = selectTarotMessage('the-fool', 'positionInterpretations', 0, 'future');
      
      expect(pastMessage).toBeDefined();
      expect(presentMessage).toBeDefined();
      expect(futureMessage).toBeDefined();
      
      // 異なるメッセージであることを確認
      expect(pastMessage).not.toEqual(presentMessage);
      expect(presentMessage).not.toEqual(futureMessage);
    });

    it('カテゴリ別の解釈を取得できる', () => {
      const loveMessage = selectTarotMessage('the-fool', 'categoryInterpretations', 0, 'love');
      const careerMessage = selectTarotMessage('the-fool', 'categoryInterpretations', 0, 'career');
      
      expect(loveMessage).toBeDefined();
      expect(careerMessage).toBeDefined();
      expect(loveMessage).not.toEqual(careerMessage);
    });

    it('時間帯別メッセージを取得できる', () => {
      const morningMessage = selectTarotMessage('the-fool', 'timingMessages', 0, 'morning');
      const eveningMessage = selectTarotMessage('the-fool', 'timingMessages', 0, 'evening');
      
      expect(morningMessage).toBeDefined();
      expect(eveningMessage).toBeDefined();
      expect(morningMessage).not.toEqual(eveningMessage);
    });

    it('シード値による一貫性のある選択', () => {
      const seed = 12345;
      const message1 = selectTarotMessage('the-fool', 'uprightInterpretations', seed);
      const message2 = selectTarotMessage('the-fool', 'uprightInterpretations', seed);
      
      expect(message1).toEqual(message2);
    });

    it('異なるシード値で異なるメッセージ', () => {
      const messages = new Set();
      
      for (let i = 0; i < 10; i++) {
        const message = selectTarotMessage('the-fool', 'uprightInterpretations', i * 1000);
        messages.add(message);
      }
      
      // 少なくとも5種類以上の異なるメッセージ
      expect(messages.size).toBeGreaterThanOrEqual(5);
    });

    it('存在しないカードIDの場合は空文字を返す', () => {
      const message = selectTarotMessage('non-existent', 'uprightInterpretations', 0);
      expect(message).toBe('');
    });
  });

  describe('getCombinationMessage', () => {
    it('大アルカナ同士の組み合わせメッセージを取得', () => {
      const message = getCombinationMessage('the-fool', 'the-magician', 'major');
      expect(message).toBeDefined();
      expect(message.length).toBeGreaterThan(10);
    });

    it('同じスートとの組み合わせメッセージを取得', () => {
      const message = getCombinationMessage('ace-of-wands', 'two-of-wands', 'suit');
      expect(message).toBeDefined();
    });

    it('コートカードとの組み合わせメッセージを取得', () => {
      const message = getCombinationMessage('ace-of-wands', 'king-of-wands', 'court');
      expect(message).toBeDefined();
    });

    it('組み合わせが定義されていない場合は空文字を返す', () => {
      const message = getCombinationMessage('the-fool', 'non-existent', 'major');
      expect(message).toBe('');
    });
  });

  describe('メッセージの品質チェック', () => {
    it('すべての正位置メッセージが十分な長さを持つ', () => {
      Object.entries(MAJOR_ARCANA_MESSAGES).forEach(([cardId, messages]) => {
        messages.uprightInterpretations.forEach((interpretation, index) => {
          expect(interpretation.length).toBeGreaterThan(20);
          expect(interpretation).not.toContain('undefined');
          expect(interpretation).not.toContain('null');
        });
      });
    });

    it('すべての逆位置メッセージが十分な長さを持つ', () => {
      Object.entries(MAJOR_ARCANA_MESSAGES).forEach(([cardId, messages]) => {
        messages.reversedInterpretations.forEach((interpretation, index) => {
          expect(interpretation.length).toBeGreaterThan(20);
          expect(interpretation).not.toContain('undefined');
          expect(interpretation).not.toContain('null');
        });
      });
    });

    it('カテゴリ別メッセージがすべてのカテゴリで定義されている', () => {
      const requiredCategories = ['love', 'career', 'health', 'finance', 'spiritual', 'general'];
      
      Object.entries(MAJOR_ARCANA_MESSAGES).forEach(([cardId, messages]) => {
        requiredCategories.forEach(category => {
          const categoryMessages = messages.categoryInterpretations[category as keyof typeof messages.categoryInterpretations];
          expect(categoryMessages).toBeDefined();
          expect(categoryMessages.length).toBeGreaterThanOrEqual(5);
        });
      });
    });

    it('詩的表現が適切に定義されている', () => {
      Object.entries(MAJOR_ARCANA_MESSAGES).forEach(([cardId, messages]) => {
        expect(messages.poeticExpressions).toBeDefined();
        expect(messages.poeticExpressions.length).toBeGreaterThanOrEqual(5);
        
        messages.poeticExpressions.forEach(expression => {
          expect(expression).toMatch(/[、。]/); // 日本語の句読点を含む
          expect(expression.length).toBeGreaterThan(15);
        });
      });
    });

    it('実践的アドバイスが具体的である', () => {
      Object.entries(MAJOR_ARCANA_MESSAGES).forEach(([cardId, messages]) => {
        expect(messages.practicalAdvice).toBeDefined();
        expect(messages.practicalAdvice.length).toBeGreaterThanOrEqual(5);
        
        messages.practicalAdvice.forEach(advice => {
          // 具体的な行動を示す言葉を含むことを確認
          const actionWords = ['してみて', 'しましょう', 'してください', 'しよう'];
          const containsAction = actionWords.some(word => advice.includes(word));
          expect(containsAction).toBe(true);
        });
      });
    });
  });

  describe('メッセージの多様性と重複チェック', () => {
    it('同じカードの正位置メッセージに重複がない', () => {
      Object.entries(MAJOR_ARCANA_MESSAGES).forEach(([cardId, messages]) => {
        const uniqueMessages = new Set(messages.uprightInterpretations);
        expect(uniqueMessages.size).toBe(messages.uprightInterpretations.length);
      });
    });

    it('異なるカード間でメッセージの個性がある', () => {
      const foolMessages = MAJOR_ARCANA_MESSAGES['the-fool'];
      const magicianMessages = MAJOR_ARCANA_MESSAGES['the-magician'];
      
      // 異なるカードのメッセージが重複していないことを確認
      const foolSet = new Set(foolMessages.uprightInterpretations);
      const magicianSet = new Set(magicianMessages.uprightInterpretations);
      
      let overlap = 0;
      foolSet.forEach(msg => {
        if (magicianSet.has(msg)) overlap++;
      });
      
      expect(overlap).toBe(0);
    });
  });

  describe('完全性チェック', () => {
    it('実装されているカードの数を確認', () => {
      const majorArcanaCount = Object.keys(MAJOR_ARCANA_MESSAGES).length;
      expect(majorArcanaCount).toBeGreaterThanOrEqual(2); // 最低でもFoolとMagicianは実装済み
      
      const wandsCount = Object.keys(WANDS_MESSAGES).length;
      expect(wandsCount).toBeGreaterThanOrEqual(1); // 最低でもAce of Wandsは実装済み
    });

    it('すべてのメッセージタイプが一貫した構造を持つ', () => {
      const allCardIds = Object.keys(ALL_TAROT_MESSAGES);
      
      allCardIds.forEach(cardId => {
        const message = ALL_TAROT_MESSAGES[cardId];
        
        // 必須フィールドの存在確認
        expect(message.uprightInterpretations).toBeDefined();
        expect(Array.isArray(message.uprightInterpretations)).toBe(true);
        
        expect(message.reversedInterpretations).toBeDefined();
        expect(Array.isArray(message.reversedInterpretations)).toBe(true);
        
        expect(message.positionInterpretations).toBeDefined();
        expect(typeof message.positionInterpretations).toBe('object');
        
        expect(message.categoryInterpretations).toBeDefined();
        expect(typeof message.categoryInterpretations).toBe('object');
        
        expect(message.timingMessages).toBeDefined();
        expect(typeof message.timingMessages).toBe('object');
        
        expect(message.combinations).toBeDefined();
        expect(typeof message.combinations).toBe('object');
      });
    });
  });
});