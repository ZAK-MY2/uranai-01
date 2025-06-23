import { NextResponse } from 'next/server';
import { getCachedEnvironmentData } from '@/lib/api/public-environment';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const longitude = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
    
    // 環境データを取得
    const environmentData = await getCachedEnvironmentData(latitude, longitude);
    
    // Supabaseに保存を試みる（失敗しても続行）
    try {
      const supabase = await createClient();
      await supabase
        .from('environment_logs')
        .insert({
          data_type: 'api_fetch',
          location: environmentData.location,
          data: environmentData
        });
    } catch (dbError) {
      console.error('環境データ保存エラー:', dbError);
    }
    
    return NextResponse.json(environmentData);
  } catch (error) {
    console.error('環境データAPI エラー:', error);
    return NextResponse.json(
      { error: '環境データの取得に失敗しました' },
      { status: 500 }
    );
  }
}