# Tarot Card Data Structure for Implementation

## Major Arcana Data Template

```typescript
interface MajorArcanaCard {
  id: string;
  number: number;
  name: string;
  keywords: string[];
  element?: 'fire' | 'water' | 'air' | 'earth';
  astrology?: {
    type: 'planet' | 'zodiac';
    value: string;
  };
  upright: {
    general: string;
    love: string;
    career: string;
    spirituality: string;
  };
  reversed: {
    general: string;
    love: string;
    career: string;
    spirituality: string;
  };
  symbolism: string[];
  journey: string; // Position in Fool's Journey
}
```

## Sample Major Arcana Cards

### 0 - The Fool
```json
{
  "id": "major-00",
  "number": 0,
  "name": "The Fool",
  "keywords": ["new beginnings", "innocence", "spontaneity", "free spirit", "adventure"],
  "element": "air",
  "upright": {
    "general": "The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe.",
    "love": "New romantic adventures, carefree love, taking a leap of faith in relationships",
    "career": "New job opportunities, career changes, entrepreneurial ventures, fresh starts",
    "spirituality": "Beginning of spiritual journey, openness to new beliefs, childlike wonder"
  },
  "reversed": {
    "general": "The Fool reversed suggests recklessness, risk-taking, foolishness, lack of direction, poor judgment, and naivety leading to mistakes.",
    "love": "Reckless behavior in love, commitment issues, immaturity in relationships",
    "career": "Poor planning, ill-advised risks, lack of experience causing problems",
    "spirituality": "Spiritual bypassing, lack of grounding, avoiding inner work"
  },
  "symbolism": ["white dog (protection/instinct)", "cliff edge (risk)", "white rose (purity)", "knapsack (untapped knowledge)"],
  "journey": "The beginning - setting out on the journey of life"
}
```

### I - The Magician
```json
{
  "id": "major-01",
  "number": 1,
  "name": "The Magician",
  "keywords": ["manifestation", "willpower", "skill", "resourcefulness", "power"],
  "astrology": {
    "type": "planet",
    "value": "Mercury"
  },
  "upright": {
    "general": "The Magician is about manifestation, using all of your skills and tools to achieve your goals, taking action, and channeling the power of the universe through yourself.",
    "love": "Using charm and communication, manifesting ideal relationship, taking initiative in love",
    "career": "Having all skills needed for success, good time for negotiations, leadership abilities",
    "spirituality": "Connecting heaven and earth, channeling divine energy, active spiritual practice"
  },
  "reversed": {
    "general": "The Magician reversed indicates manipulation, poor planning, untapped talents, illusion, and being out of touch with reality.",
    "love": "Manipulation in relationships, empty promises, lack of genuine connection",
    "career": "Missed opportunities, lack of focus, potential not being realized",
    "spirituality": "Disconnection from higher self, misuse of spiritual gifts, ego-driven practices"
  },
  "symbolism": ["infinity symbol (unlimited potential)", "four suits on table (mastery of elements)", "raised wand (channeling energy)", "red robe (passion/knowledge)"],
  "journey": "Gaining consciousness and willpower to shape reality"
}
```

## Minor Arcana Data Template

```typescript
interface MinorArcanaCard {
  id: string;
  number: number;
  name: string;
  suit: 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  numerology: string;
  upright: {
    general: string;
    specific: string; // suit-specific interpretation
  };
  reversed: {
    general: string;
    specific: string;
  };
  element: 'fire' | 'water' | 'air' | 'earth';
  timing?: string; // For predictive readings
}
```

## Sample Minor Arcana Cards

### Ace of Wands
```json
{
  "id": "wands-01",
  "number": 1,
  "name": "Ace of Wands",
  "suit": "wands",
  "keywords": ["inspiration", "new opportunity", "growth", "potential", "spark"],
  "numerology": "New beginnings, raw potential",
  "upright": {
    "general": "A new creative or spiritual opportunity is being offered to you. This is pure potential and the seed of something great.",
    "specific": "New passion project, creative inspiration, spiritual awakening, entrepreneurial opportunity"
  },
  "reversed": {
    "general": "Delays in new ventures, lack of direction, creative blocks, missed opportunities",
    "specific": "Creative frustration, false starts, lack of passion or motivation"
  },
  "element": "fire",
  "timing": "Spring, new moon, 1-3 days"
}
```

### Five of Cups
```json
{
  "id": "cups-05",
  "number": 5,
  "name": "Five of Cups",
  "suit": "cups",
  "keywords": ["loss", "grief", "disappointment", "regret", "mourning"],
  "numerology": "Conflict, instability, change",
  "upright": {
    "general": "Experiencing loss and grief, but not all is lost. Time to process emotions and eventually move forward.",
    "specific": "Emotional disappointment, mourning a relationship, focusing on what went wrong"
  },
  "reversed": {
    "general": "Moving on from grief, acceptance, forgiveness, finding peace after loss",
    "specific": "Emotional recovery, letting go of the past, finding silver linings"
  },
  "element": "water",
  "timing": "Autumn, waning moon, 5 weeks/months"
}
```

## Court Card Template

```typescript
interface CourtCard {
  id: string;
  rank: 'page' | 'knight' | 'queen' | 'king';
  suit: 'wands' | 'cups' | 'swords' | 'pentacles';
  name: string;
  keywords: string[];
  personality: string;
  appearance?: string; // Physical/age description
  upright: {
    person: string;
    situation: string;
    advice: string;
  };
  reversed: {
    person: string;
    situation: string;
    advice: string;
  };
  element: 'fire' | 'water' | 'air' | 'earth';
  zodiacSigns?: string[]; // Associated zodiac signs
}
```

### Sample Court Card - Queen of Cups
```json
{
  "id": "cups-queen",
  "rank": "queen",
  "suit": "cups",
  "name": "Queen of Cups",
  "keywords": ["compassion", "intuition", "emotional intelligence", "nurturing", "psychic"],
  "personality": "Emotionally mature, intuitive, caring, possibly psychic or highly empathic",
  "appearance": "Mature woman, often fair-haired, gentle demeanor",
  "upright": {
    "person": "A nurturing, intuitive person who leads with their heart. Often a mother figure or counselor.",
    "situation": "Time to trust intuition, show compassion, emotional fulfillment",
    "advice": "Listen to your inner voice, be compassionate, trust your feelings"
  },
  "reversed": {
    "person": "Someone emotionally unstable, codependent, or manipulative through emotions",
    "situation": "Emotional imbalance, ignoring intuition, being overly sensitive",
    "advice": "Set emotional boundaries, ground yourself, avoid emotional manipulation"
  },
  "element": "water",
  "zodiacSigns": ["Cancer", "Scorpio", "Pisces"]
}
```

## Spread Position Data

```typescript
interface SpreadPosition {
  position: number;
  name: string;
  question: string; // What this position asks
  timeFrame?: 'past' | 'present' | 'future';
  aspect?: string; // What aspect of life/situation
}
```

### Celtic Cross Positions
```json
[
  {
    "position": 1,
    "name": "Present Situation",
    "question": "What is the current situation?",
    "timeFrame": "present",
    "aspect": "current state"
  },
  {
    "position": 2,
    "name": "Challenge/Cross",
    "question": "What is crossing or challenging you?",
    "timeFrame": "present",
    "aspect": "obstacles"
  },
  {
    "position": 3,
    "name": "Distant Past",
    "question": "What past events led to this situation?",
    "timeFrame": "past",
    "aspect": "foundation"
  },
  {
    "position": 4,
    "name": "Recent Past",
    "question": "What recent events are affecting the situation?",
    "timeFrame": "past",
    "aspect": "influences"
  },
  {
    "position": 5,
    "name": "Possible Future",
    "question": "What is a possible outcome?",
    "timeFrame": "future",
    "aspect": "potential"
  },
  {
    "position": 6,
    "name": "Immediate Future",
    "question": "What will happen in the near future?",
    "timeFrame": "future",
    "aspect": "approaching"
  },
  {
    "position": 7,
    "name": "Your Approach",
    "question": "How are you approaching this situation?",
    "timeFrame": "present",
    "aspect": "self"
  },
  {
    "position": 8,
    "name": "External Influences",
    "question": "What external factors are at play?",
    "timeFrame": "present",
    "aspect": "environment"
  },
  {
    "position": 9,
    "name": "Hopes and Fears",
    "question": "What are your hopes or fears?",
    "timeFrame": "present",
    "aspect": "internal"
  },
  {
    "position": 10,
    "name": "Final Outcome",
    "question": "What is the ultimate outcome?",
    "timeFrame": "future",
    "aspect": "resolution"
  }
]
```

## Interpretation Rules Engine

```typescript
interface InterpretationRules {
  // Elemental Dignities
  elementalDignities: {
    strengthening: [['fire', 'air'], ['water', 'earth']];
    weakening: [['fire', 'water'], ['air', 'earth']];
    neutral: [['fire', 'earth'], ['water', 'air']];
  };
  
  // Card Combinations
  combinations: {
    cards: string[];
    meaning: string;
    context?: 'love' | 'career' | 'general';
  }[];
  
  // Reversal Rules
  reversalInterpretation: {
    method: 'opposite' | 'blocked' | 'internal' | 'shadow';
    modifier: number; // 0.5 to 1.5 strength modifier
  };
}
```

## Implementation Notes

1. **Data Storage**: Consider using JSON files for card data, loaded into memory on app initialization
2. **Randomization**: Use cryptographically secure random for card selection
3. **State Management**: Track drawn cards to prevent duplicates in multi-card spreads
4. **Interpretation Engine**: Build flexible system that combines:
   - Base card meanings
   - Position meanings
   - Card relationships
   - Question context
5. **Personalization**: Allow users to:
   - Save favorite spreads
   - Journal about readings
   - Track patterns over time
   - Choose interpretation style (psychological vs traditional)

This structure provides a solid foundation for implementing a comprehensive tarot system with rich interpretations and flexible spread options.