// Complex API Route
import { NextRequest, NextResponse } from 'next/server';
import { divinationIntegrator } from '@/lib/divination/integrator';
import { createClient } from '@/lib/supabase/server';
import { IntegratedDivinationInput, DivinationResponse } from '@/types/divination';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの解析
    const body: IntegratedDivinationInput = await request.json();

    // 入力検証
    if (!body.fullName || !body.birthDate || !body.question || !body.spreadType) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '名前、生年月日、質問、スプレッドタイプは必須です'
      }, { status: 400 });
    }

    // Complex実行
    const result = await divinationIntegrator.performIntegratedReading(body);

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
            session_type: 'integrated',
            input_data: body,
            results: result,
            environment_data: result.environment,
            interpretation: result.integration.overallGuidance
          });
      } catch (dbError) {
        console.error('セッション保存エラー:', dbError);
      }
    }

    // 環境データをログに保存
    try {
      await supabase
        .from('environment_logs')
        .insert({
          data_type: 'integrated',
          location: result.environment.location,
          data: result.environment
        });
    } catch (envError) {
      console.error('環境データ保存エラー:', envError);
    }

    // キャッシュに保存
    try {
      const cacheKey = divinationIntegrator.generateCacheKey(body);
      const inputHash = divinationIntegrator.generateInputHash(body);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1時間（環境データが変わるため短めに設定）

      await supabase
        .from('divination_cache')
        .upsert({
          cache_key: cacheKey,
          divination_type: 'integrated',
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
      message: '統合占術が完了しました'
    });

  } catch (error) {
    console.error('統合占術API エラー:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? `${error.message}\n詳細: ${error.stack}` : '統合占術中にエラーが発生しました'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // ユーザーの占術履歴を取得
    if (searchParams.get('history') === 'true') {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json<DivinationResponse<null>>({
          success: false,
          error: 'ログインが必要です'
        }, { status: 401 });
      }

      const { data: sessions, error: sessionsError } = await supabase
        .from('divination_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (sessionsError) {
        throw new Error(`履歴取得エラー: ${sessionsError.message}`);
      }

      return NextResponse.json<DivinationResponse<typeof sessions>>({
        success: true,
        data: sessions,
        message: '占術履歴を取得しました'
      });
    }

    // 現在の環境データのみを取得
    if (searchParams.get('environment') === 'true') {
      const lat = parseFloat(searchParams.get('lat') || '35.6762');
      const lon = parseFloat(searchParams.get('lon') || '139.6503');

      const { environmentEngine } = await import('@/lib/environment');
      const environment = await environmentEngine.getCurrentEnvironment(lat, lon);

      return NextResponse.json<DivinationResponse<typeof environment>>({
        success: true,
        data: environment,
        message: '現在の環境データを取得しました'
      });
    }

    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: 'クエリパラメータを指定してください: history=true または environment=true'
    }, { status: 400 });

  } catch (error) {
    console.error('統合占術API GET エラー:', error);
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'データ取得中にエラーが発生しました'
    }, { status: 500 });
  }
}