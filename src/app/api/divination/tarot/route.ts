// タロット占い API Route
import { NextRequest, NextResponse } from 'next/server';
import { tarotEngine } from '@/lib/divination/tarot';
import { createClient } from '@/lib/supabase/server';
import { TarotInput, DivinationResponse } from '@/types/divination';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの解析
    const body = await request.json();
    const { question, spreadType, seed }: TarotInput = body;

    // 入力検証
    if (!question || !spreadType) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '質問とスプレッドタイプは必須です'
      }, { status: 400 });
    }

    // 利用可能なスプレッド確認
    const availableSpreads = tarotEngine.getAvailableSpreads();
    if (!availableSpreads[spreadType]) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: `不明なスプレッドタイプ: ${spreadType}. 利用可能: ${Object.keys(availableSpreads).join(', ')}`
      }, { status: 400 });
    }

    // タロット占い実行
    const result = await tarotEngine.drawCards({ question, spreadType, seed });

    // Supabaseクライアント作成
    const supabase = await createClient();

    // ユーザー情報取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.warn('認証エラー:', authError.message);
    }

    // セッション保存（ユーザーがログインしている場合）
    if (user) {
      try {
        await supabase
          .from('divination_sessions')
          .insert({
            user_id: user.id,
            session_type: 'tarot',
            input_data: { question, spreadType, seed },
            results: result,
            interpretation: result.overall
          });
      } catch (dbError) {
        console.error('セッション保存エラー:', dbError);
      }
    }

    // キャッシュに保存（シード値が指定されている場合のみ）
    if (seed) {
      try {
        const cacheKey = tarotEngine.generateCacheKey({ question, spreadType, seed });
        const inputHash = tarotEngine.generateInputHash({ question, spreadType, seed });
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1時間（タロットは短めに設定）

        await supabase
          .from('divination_cache')
          .upsert({
            cache_key: cacheKey,
            divination_type: 'tarot',
            input_hash: inputHash,
            result_data: result,
            expires_at: expiresAt.toISOString()
          });
      } catch (cacheError) {
        console.error('キャッシュ保存エラー:', cacheError);
      }
    }

    return NextResponse.json<DivinationResponse<typeof result>>({
      success: true,
      data: result,
      message: 'タロット占いが完了しました'
    });

  } catch (error) {
    console.error('タロットAPI エラー:', error);
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : '占い中にエラーが発生しました'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 利用可能なスプレッド一覧を返す
    if (searchParams.get('spreads') === 'true') {
      const spreads = tarotEngine.getAvailableSpreads();
      return NextResponse.json<DivinationResponse<typeof spreads>>({
        success: true,
        data: spreads,
        message: '利用可能なタロットスプレッド一覧'
      });
    }

    // 単一カード占い
    const question = searchParams.get('question');
    const seed = searchParams.get('seed');

    if (!question) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '質問をクエリパラメータで指定してください'
      }, { status: 400 });
    }

    const result = await tarotEngine.drawSingleCard(question, seed || undefined);

    return NextResponse.json<DivinationResponse<typeof result>>({
      success: true,
      data: result,
      message: '今日のタロットカードです'
    });

  } catch (error) {
    console.error('タロットAPI GET エラー:', error);
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'データ取得中にエラーが発生しました'
    }, { status: 500 });
  }
}