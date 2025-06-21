// 数秘術 API Route
import { NextRequest, NextResponse } from 'next/server';
import { numerologyEngine } from '@/lib/divination/numerology';
import { createClient } from '@/lib/supabase/server';
import { NumerologyInput, DivinationResponse } from '@/types/divination';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの解析
    const body = await request.json();
    const { fullName, birthDate }: NumerologyInput = body;

    // 入力検証
    if (!fullName || !birthDate) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '名前と生年月日は必須です'
      }, { status: 400 });
    }

    // 数秘術計算実行
    const result = await numerologyEngine.calculate({ fullName, birthDate });

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
            session_type: 'numerology',
            input_data: { fullName, birthDate },
            results: result,
            interpretation: result.interpretation.overall
          });
      } catch (dbError) {
        console.error('セッション保存エラー:', dbError);
        // データベースエラーでもレスポンスは返す
      }
    }

    // キャッシュに保存
    try {
      const cacheKey = numerologyEngine.generateCacheKey({ fullName, birthDate });
      const inputHash = numerologyEngine.generateInputHash({ fullName, birthDate });
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間

      await supabase
        .from('divination_cache')
        .upsert({
          cache_key: cacheKey,
          divination_type: 'numerology',
          input_hash: inputHash,
          result_data: result,
          expires_at: expiresAt.toISOString()
        });
    } catch (cacheError) {
      console.error('キャッシュ保存エラー:', cacheError);
    }

    return NextResponse.json<DivinationResponse<typeof result>>({
      success: true,
      data: result,
      message: '数秘術の計算が完了しました'
    });

  } catch (error) {
    console.error('数秘術API エラー:', error);
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : '計算中にエラーが発生しました'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fullName = searchParams.get('fullName');
    const birthDate = searchParams.get('birthDate');

    if (!fullName || !birthDate) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '名前と生年月日をクエリパラメータで指定してください'
      }, { status: 400 });
    }

    // キャッシュから検索
    const supabase = await createClient();
    const cacheKey = numerologyEngine.generateCacheKey({ fullName, birthDate });
    
    const { data: cachedResult, error: cacheError } = await supabase
      .from('divination_cache')
      .select('result_data, expires_at')
      .eq('cache_key', cacheKey)
      .single();

    if (!cacheError && cachedResult) {
      const expiresAt = new Date(cachedResult.expires_at);
      if (expiresAt > new Date()) {
        return NextResponse.json<DivinationResponse<typeof cachedResult.result_data>>({
          success: true,
          data: cachedResult.result_data,
          message: 'キャッシュから数秘術結果を取得しました'
        });
      }
    }

    // キャッシュにない場合は新規計算
    const result = await numerologyEngine.calculate({ fullName, birthDate });

    return NextResponse.json<DivinationResponse<typeof result>>({
      success: true,
      data: result,
      message: '数秘術の計算が完了しました'
    });

  } catch (error) {
    console.error('数秘術API GET エラー:', error);
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'データ取得中にエラーが発生しました'
    }, { status: 500 });
  }
}