import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="mt-4 text-gray-600">
            ようこそ、{user.email}さん！
          </p>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">ユーザー情報</h2>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">メールアドレス:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">ユーザーID:</span> {user.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">作成日:</span> {new Date(user.created_at).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
          
          <form action={handleSignOut} className="mt-8">
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}