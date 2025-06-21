import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { environmentEngine } from '@/lib/environment'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 環境データを直接取得（デフォルト: 東京）
  let environmentData = null;
  try {
    environmentData = await environmentEngine.getCurrentEnvironment(35.6762, 139.6503);
    
    // 環境データをログに保存
    try {
      await supabase
        .from('environment_logs')
        .insert({
          data_type: 'dashboard',
          location: environmentData.location,
          data: environmentData
        });
    } catch (logError) {
      console.error('環境データログ保存エラー:', logError);
      // ログ保存失敗でもレスポンスは返す
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
    .limit(3);

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🌟 COSMIC ORACLE</h1>
            <p className="text-blue-200">ようこそ、{user.email?.split('@')[0]}さん</p>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ログアウト
            </button>
          </form>
        </div>

        {/* 環境データ表示 */}
        {environmentData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">🌙 現在の宇宙エネルギー</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🌙</div>
                <div className="text-white font-medium">{environmentData.lunar.phaseName}</div>
                <div className="text-blue-200 text-sm">照度: {environmentData.lunar.illumination}%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🌤️</div>
                <div className="text-white font-medium">{environmentData.weather.condition}</div>
                <div className="text-blue-200 text-sm">{environmentData.weather.temperature}°C</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏛️</div>
                <div className="text-white font-medium">プラネタリーアワー</div>
                <div className="text-blue-200 text-sm">
                  {environmentData.astronomical.planetaryHours[0]?.planet || '太陽'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 占術メニュー */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/divination/numerology" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
              <div className="text-4xl mb-4">🔢</div>
              <h3 className="text-xl font-semibold text-white mb-2">数秘術</h3>
              <p className="text-blue-200 text-sm">あなたの名前と生年月日から人生の道筋を読み解きます。</p>
            </div>
          </Link>

          <Link href="/divination/tarot" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
              <div className="text-4xl mb-4">🃏</div>
              <h3 className="text-xl font-semibold text-white mb-2">タロット占い</h3>
              <p className="text-blue-200 text-sm">カードが示す未来への指針とメッセージを受け取ります。</p>
            </div>
          </Link>

          <Link href="/divination/astrology" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-white mb-2">西洋占星術</h3>
              <p className="text-blue-200 text-sm">天体の配置があなたの運命を物語ります。</p>
            </div>
          </Link>

          <Link href="/divination/integrated" className="group lg:col-span-2">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-6 border border-white/30 hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300 group-hover:scale-105">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-white mb-2">統合占術リーディング</h3>
              <p className="text-blue-200 text-sm">
                数秘術・タロット・占星術・環境データを統合した最強の占いシステムです。
                複数の占術を組み合わせることで、より深い洞察と具体的なガイダンスを提供します。
              </p>
            </div>
          </Link>

          <Link href="/divination/environment" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">環境データ</h3>
              <p className="text-blue-200 text-sm">現在の月相・天候・天体データをリアルタイムで確認できます。</p>
            </div>
          </Link>
        </div>

        {/* 最近の占術履歴 */}
        {recentSessions && recentSessions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">📖 最近の占術履歴</h2>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {session.session_type === 'numerology' && '🔢 数秘術'}
                        {session.session_type === 'tarot' && '🃏 タロット'}
                        {session.session_type === 'astrology' && '⭐ 占星術'}
                        {session.session_type === 'integrated' && '✨ 統合占術'}
                      </div>
                      <div className="text-blue-200 text-sm">
                        {new Date(session.created_at).toLocaleString('ja-JP')}
                      </div>
                    </div>
                    <Link 
                      href={`/divination/history/${session.id}`}
                      className="text-blue-300 hover:text-blue-100 text-sm underline"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-sm">
            🌟 COSMIC ORACLE - 宇宙の叡智があなたを導きます 🌟
          </p>
        </div>
      </div>
    </div>
  )
}