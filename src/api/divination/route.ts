import { NextRequest, NextResponse } from 'next/server';
import { NumerologyEngine } from '@/lib/divination/engines/numerology-engine';
import { TarotEngine } from '@/lib/divination/engines/tarot-engine';
import { AstrologyEngine } from '@/lib/divination/engines/astrology-engine';
import { IChingEngine } from '@/lib/divination/engines/iching-engine';
import { NineStarKiEngine } from '@/lib/divination/engines/nine-star-ki-engine';
import { RunesEngine } from '@/lib/divination/engines/runes-engine';
import { VedicEngine } from '@/lib/divination/engines/vedic-engine';
import { CelticEngine } from '@/lib/divination/engines/celtic-engine';
import { ShichuSuimeiEngine } from '@/lib/divination/engines/shichu-suimei-engine';
import { KabbalahEngine } from '@/lib/divination/engines/kabbalah-engine';
import { DivinationInput } from '@/lib/divination/base-engine';
import { EnvironmentService } from '@/lib/services/environment-service';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userData }: { type: string; userData: UserData } = body;

    if (!type || !userData) {
      return NextResponse.json({ error: 'Missing type or userData' }, { status: 400 });
    }

    // Convert userData to DivinationInput format
    const input: DivinationInput = {
      fullName: userData.fullName,
      birthDate: new Date(userData.birthDate),
      birthTime: userData.birthTime,
      birthPlace: userData.birthPlace,
      question: userData.question || '',
      questionCategory: 'general'
    };

    // Get environment data for enhanced accuracy
    const environmentData = await EnvironmentService.getInstance().getEnvironmentData(input.birthPlace);

    let result;

    switch (type) {
      case 'numerology':
        const numerologyEngine = new NumerologyEngine(input, environmentData);
        result = numerologyEngine.calculate();
        break;

      case 'tarot':
        const tarotEngine = new TarotEngine(input, environmentData);
        result = tarotEngine.calculate();
        break;

      case 'astrology':
        const astrologyEngine = new AstrologyEngine(input, environmentData);
        result = astrologyEngine.calculate();
        break;

      case 'iching':
        const ichingEngine = new IChingEngine(input, environmentData);
        result = ichingEngine.calculate();
        break;

      case 'nine-star-ki':
        const nineStarKiEngine = new NineStarKiEngine(input, environmentData);
        result = nineStarKiEngine.calculate();
        break;

      case 'runes':
        const runesEngine = new RunesEngine(input, environmentData);
        result = runesEngine.calculate();
        break;

      case 'vedic':
        const vedicEngine = new VedicEngine(input, environmentData);
        result = vedicEngine.calculate();
        break;

      case 'celtic':
        const celticEngine = new CelticEngine(input, environmentData);
        result = celticEngine.calculate();
        break;

      case 'shichu-suimei':
        const shichuSuimeiEngine = new ShichuSuimeiEngine(input, environmentData);
        result = shichuSuimeiEngine.calculate();
        break;

      case 'kabbalah':
        const kabbalahEngine = new KabbalahEngine(input, environmentData);
        result = kabbalahEngine.calculate();
        break;

      default:
        return NextResponse.json({ error: 'Invalid divination type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('Divination API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}