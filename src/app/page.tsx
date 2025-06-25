import { redirect } from 'next/navigation'

export default async function Home() {
  // 正しいユーザーフロー: entry → input → dashboard
  redirect('/entry');
}