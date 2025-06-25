import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // 本番環境では認証必須、ただしデモ用スキップ可能
  if (!user) {
    if (process.env.NODE_ENV === 'production' && !process.env.SKIP_AUTH_FOR_DEMO) {
      redirect('/login')
    } else {
      // 開発・テスト用: ダミーユーザーで継続
      const dummyUser = { 
        id: 'test-user-001', 
        email: 'test@cosmic-oracle.dev',
        user_metadata: {
          name: 'テストユーザー',
          avatar_url: null
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as any;
      
      return <DashboardClient user={dummyUser} environmentData={null} sessions={[]} />;
    }
  }

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
  const { data: recentSessions } = await supabase
    .from('divination_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return <DashboardClient user={user} environmentData={environmentData} sessions={recentSessions || []} />;
}