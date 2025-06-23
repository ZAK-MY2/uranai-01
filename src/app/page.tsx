import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
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

  return <DashboardClient user={user} environmentData={environmentData} sessions={recentSessions} />;
}