// 環境データ API Route
import { NextRequest, NextResponse } from 'next/server';
import { environmentEngine } from '@/lib/environment';
import { createClient } from '@/lib/supabase/server';
import { DivinationResponse } from '@/types/divination';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 位置情報の取得（デフォルト: 東京）
    const lat = parseFloat(searchParams.get('lat') || '35.6762');
    const lon = parseFloat(searchParams.get('lon') || '139.6503');

    // 緯度経度の妥当性チェック
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '無効な緯度経度です。緯度: -90~90, 経度: -180~180'
      }, { status: 400 });
    }

    // 環境データ取得
    const environment = await environmentEngine.getCurrentEnvironment(lat, lon);

    // Supabaseクライアント作成
    const supabase = await createClient();

    // 環境データをログに保存
    try {
      await supabase
        .from('environment_logs')
        .insert({
          data_type: 'current',
          location: environment.location,
          data: environment
        });
    } catch (logError) {
      console.error('環境データログ保存エラー:', logError);
      // ログ保存失敗でもレスポンスは返す
    }

    return NextResponse.json<DivinationResponse<typeof environment>>({
      success: true,
      data: environment,
      message: '現在の環境データを取得しました'
    });

  } catch (error) {
    console.error('環境データAPI エラー:', error);
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : '環境データ取得中にエラーが発生しました'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // ユーザーの現在位置情報を受け取って環境データを取得
    const body = await request.json();
    const { latitude, longitude } = body;

    if (!latitude || !longitude) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '緯度と経度は必須です'
      }, { status: 400 });
    }

    // 緯度経度の妥当性チェック
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json<DivinationResponse<null>>({
        success: false,
        error: '無効な緯度経度です。緯度: -90~90, 経度: -180~180'
      }, { status: 400 });
    }

    // 環境データ取得
    const environment = await environmentEngine.getCurrentEnvironment(latitude, longitude);

    // Supabaseクライアント作成
    const supabase = await createClient();

    // ユーザー情報取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // ユーザーの設定を更新（ログインしている場合）
    if (user && !authError) {
      try {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            setting_key: 'last_location',
            setting_value: { latitude, longitude, timestamp: new Date().toISOString() }
          });
      } catch (settingError) {
        console.error('位置情報設定保存エラー:', settingError);
      }
    }

    // 環境データをログに保存
    try {
      await supabase
        .from('environment_logs')
        .insert({
          data_type: 'user_location',
          location: { latitude, longitude },
          data: environment
        });
    } catch (logError) {
      console.error('環境データログ保存エラー:', logError);
    }

    return NextResponse.json<DivinationResponse<typeof environment>>({
      success: true,
      data: environment,
      message: 'ユーザー位置の環境データを取得しました'
    });

  } catch (error) {
    console.error('環境データAPI POST エラー:', error);
    return NextResponse.json<DivinationResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : '環境データ取得中にエラーが発生しました'
    }, { status: 500 });
  }
}