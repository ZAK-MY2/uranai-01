import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '../dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // デモモード: ダミーユーザーで継続
  const dummyUser = { 
    id: 'test-user-001', 
    email: 'test@oracle-echo.dev',
    user_metadata: {
      name: 'テストユーザー',
      avatar_url: null
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  } as any;

  // 環境データを取得
  let environmentData = null;
  try {
    const { data } = await supabase
      .from('environment_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (data && data[0]) {
      environmentData = data[0].data;
    }
  } catch (error) {
    console.error('環境データ取得エラー:', error);
  }

  // 最近のセッションを取得
  const recentSessions: any[] = [];

  return <DashboardClient user={dummyUser} environmentData={environmentData} sessions={recentSessions} />;
}