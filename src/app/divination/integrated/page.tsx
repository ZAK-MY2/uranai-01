'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IntegratedDivinationInput, IntegratedDivinationResult } from '@/types/divination'

export default function IntegratedDivinationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<IntegratedDivinationResult | null>(null)

  const [formData, setFormData] = useState<IntegratedDivinationInput>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthLocation: undefined,
    question: '',
    spreadType: 'three_card',
    currentLocation: undefined
  })

  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')

  // 位置情報の取得
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('お使いのブラウザでは位置情報がサポートされていません')
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }))
        setLocationPermission('granted')
        setIsLoading(false)
      },
      (error) => {
        console.error('位置情報取得エラー:', error)
        setError('位置情報の取得に失敗しました。手動で設定するか、ブラウザの位置情報許可を確認してください。')
        setLocationPermission('denied')
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分間キャッシュ
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 必須フィールドのバリデーション
      if (!formData.fullName || !formData.birthDate || !formData.question) {
        throw new Error('名前、生年月日、質問は必須です')
      }

      const response = await fetch('/api/divination/integrated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      console.log('API Response:', data); // デバッグ用

      if (!data.success) {
        throw new Error(data.error || '統合占術の実行に失敗しました')
      }

      setResult(data.data)
    } catch (err) {
      console.error('Client error:', err); // デバッグ用
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <Link href="/" className="text-blue-300 hover:text-blue-100 text-sm">
                ← ダッシュボードに戻る
              </Link>
              <h1 className="text-3xl font-bold text-white mt-4 mb-2">✨ 統合占術リーディング結果</h1>
              <p className="text-blue-200">宇宙の叡智が導く統合的なメッセージ</p>
            </div>

            {/* 環境データ */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">🌍 占術実行時の環境エネルギー</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🌙</div>
                  <div className="text-white font-medium">{result.environment.lunar.phaseName}</div>
                  <div className="text-blue-200 text-sm">照度: {result.environment.lunar.illumination}%</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🌤️</div>
                  <div className="text-white font-medium">{result.environment.weather.condition}</div>
                  <div className="text-blue-200 text-sm">{result.environment.weather.temperature}°C</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="text-white font-medium">
                    {new Date(result.environment.timestamp).toLocaleString('ja-JP')}
                  </div>
                  <div className="text-blue-200 text-sm">占術実行時刻</div>
                </div>
              </div>
            </div>

            {/* 統合解釈 */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/30">
              <h2 className="text-xl font-semibold text-white mb-4">🔮 統合的な指針</h2>
              <div className="prose prose-invert max-w-none">
                <div className="text-white whitespace-pre-line">
                  {result.integration.overallGuidance}
                </div>
              </div>
            </div>

            {/* 個別占術結果 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* 数秘術結果 */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">🔢 数秘術</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-blue-200">ライフパス:</span>
                    <span className="text-white ml-2 font-medium">{result.numerology.lifePath}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">運命数:</span>
                    <span className="text-white ml-2 font-medium">{result.numerology.destiny}</span>
                  </div>
                  <div className="text-blue-100 text-sm">
                    {result.numerology.interpretation.overall.substring(0, 100)}...
                  </div>
                </div>
              </div>

              {/* タロット結果 */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">🃏 タロット</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-blue-200">スプレッド:</span>
                    <span className="text-white ml-2 font-medium">{result.tarot.spread.name}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">キーカード:</span>
                    <span className="text-white ml-2 font-medium">{result.tarot.cards[0]?.card.name}</span>
                  </div>
                  <div className="text-blue-100 text-sm">
                    {result.tarot.overall.substring(0, 100)}...
                  </div>
                </div>
              </div>
            </div>

            {/* その他の占術結果 - 第2列 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* 易経結果 */}
              {result.iching && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">☯️ 易経</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-200">卦:</span>
                      <span className="text-white ml-2 font-medium">{result.iching.hexagram?.name || '乾為天'}</span>
                    </div>
                    <div className="text-blue-100 text-sm">
                      {result.iching.interpretation?.substring(0, 100) || '古代中国の叡智が示すメッセージ'}...
                    </div>
                  </div>
                </div>
              )}

              {/* 四柱推命結果 */}
              {result.shichu && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">🀄 四柱推命</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-200">主要素:</span>
                      <span className="text-white ml-2 font-medium">{result.shichu.elements?.dominant || '木'}</span>
                    </div>
                    <div className="text-blue-100 text-sm">
                      {result.shichu.analysis?.overall?.substring(0, 100) || '東洋の占術から読み解く運命'}...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* その他の占術結果 - 第3列 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* ルーン結果 */}
              {result.runes && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">🎯 ルーン</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-200">主ルーン:</span>
                      <span className="text-white ml-2 font-medium">{result.runes.runes?.[0]?.name || 'Fehu'}</span>
                    </div>
                    <div className="text-blue-100 text-sm">
                      {result.runes.interpretation?.substring(0, 100) || '北欧の古代文字が示す導き'}...
                    </div>
                  </div>
                </div>
              )}

              {/* 手相結果 */}
              {result.palmistry && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">🤚 手相</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-200">性格:</span>
                      <span className="text-white ml-2 font-medium text-sm">{result.palmistry.analysis?.personality?.substring(0, 50) || '意志の強さと創造性'}...</span>
                    </div>
                    <div className="text-blue-100 text-sm">
                      {result.palmistry.interpretation?.overall?.substring(0, 100) || '手のひらに刻まれた運命の軌跡'}...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* その他の占術結果 - 第4列 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* ヴェーダ占星術結果 */}
              {result.vedic && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">🕉️ ヴェーダ占星術</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-200">月座:</span>
                      <span className="text-white ml-2 font-medium">{result.vedic.chart?.moonSign || 'Aries'}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">ナクシャトラ:</span>
                      <span className="text-white ml-2 font-medium">{result.vedic.chart?.nakshatra || 'Ashwini'}</span>
                    </div>
                    <div className="text-blue-100 text-sm">
                      {result.vedic.interpretation?.overall?.substring(0, 100) || 'インド古代の智慧が示す人生の道筋'}...
                    </div>
                  </div>
                </div>
              )}

              {/* 西洋占星術結果 */}
              {result.astrology && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">♓ 西洋占星術</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-200">太陽座:</span>
                      <span className="text-white ml-2 font-medium">{result.astrology.sunSign?.sign || '牡羊座'}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">月座:</span>
                      <span className="text-white ml-2 font-medium">{result.astrology.moonSign?.sign || '不明'}</span>
                    </div>
                    <div className="text-blue-100 text-sm">
                      {result.astrology.interpretation?.substring(0, 100) || '星々の配置が語る運命の物語'}...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 共通テーマと矛盾 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">🎭 共通テーマ</h3>
                <ul className="space-y-2">
                  {result.integration.commonThemes.map((theme, index) => (
                    <li key={index} className="text-blue-100 text-sm">• {theme}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">⚖️ 注意点</h3>
                <ul className="space-y-2">
                  {result.integration.contradictions.map((contradiction, index) => (
                    <li key={index} className="text-yellow-200 text-sm">• {contradiction}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 具体的アドバイス */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">💡 具体的なアドバイス</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.integration.specificAdvice.map((advice, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="text-blue-100 text-sm">{advice}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 環境的影響 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">🌟 環境的影響</h3>
              <div className="text-blue-100">
                {result.integration.environmentalInfluence}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="text-center space-x-4">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                もう一度占う
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <Link href="/" className="text-blue-300 hover:text-blue-100 text-sm">
              ← ダッシュボードに戻る
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4 mb-2">✨ 統合占術リーディング</h1>
            <p className="text-blue-200">9種類の占術と環境データを統合した最強の占いシステム</p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <div className="text-red-100">{error}</div>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">👤 基本情報</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    フルネーム（漢字・ひらがな）*
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300"
                    placeholder="山田太郎"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    生年月日*
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    出生時刻（正確な占星術のため）
                  </label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                  />
                  <p className="text-blue-300 text-xs mt-1">
                    任意ですが、より精密な占星術結果のために推奨
                  </p>
                </div>
              </div>
            </div>

            {/* 質問とタロット設定 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">🔮 占いの内容</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    占いたい質問・相談内容*
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 h-24"
                    placeholder="恋愛、仕事、人間関係など、どんなことでもお聞かせください"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    タロットスプレッド
                  </label>
                  <select
                    value={formData.spreadType}
                    onChange={(e) => setFormData({...formData, spreadType: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                  >
                    <option value="single_card">一枚引き</option>
                    <option value="three_card">過去・現在・未来（3枚）</option>
                    <option value="five_card">5枚スプレッド</option>
                    <option value="celtic_cross">ケルト十字（10枚・詳細）</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 位置情報設定 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">📍 環境データ設定</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useLocation"
                    checked={useCurrentLocation}
                    onChange={(e) => {
                      setUseCurrentLocation(e.target.checked)
                      if (e.target.checked) {
                        getCurrentLocation()
                      }
                    }}
                    className="mr-3"
                  />
                  <label htmlFor="useLocation" className="text-white text-sm">
                    現在地の環境データを使用する（推奨）
                  </label>
                </div>

                {useCurrentLocation && formData.currentLocation && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                    <div className="text-green-100 text-sm">
                      📍 位置情報が取得されました
                      <br />
                      緯度: {formData.currentLocation.latitude.toFixed(4)}°
                      <br />
                      経度: {formData.currentLocation.longitude.toFixed(4)}°
                    </div>
                  </div>
                )}

                <p className="text-blue-300 text-xs">
                  より正確な環境データ（月相・天候・天体データ）を取得するため、位置情報の使用を推奨します。
                  位置情報は占術計算にのみ使用され、プライバシーは保護されます。
                </p>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '宇宙と対話中...' : '✨ 統合占術を実行する'}
              </button>
            </div>
          </form>

          {/* 注意事項 */}
          <div className="mt-8 text-center">
            <p className="text-blue-300 text-xs">
              占いは娯楽・参考目的であり、重要な人生の決断は慎重にご検討ください
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}