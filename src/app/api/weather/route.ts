import { NextRequest, NextResponse } from 'next/server';

// 日本の主要都市の緯度経度
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  '東京都': { lat: 35.6762, lon: 139.6503 },
  '大阪府': { lat: 34.6937, lon: 135.5023 },
  '愛知県': { lat: 35.1802, lon: 136.9066 },
  '福岡県': { lat: 33.5904, lon: 130.4017 },
  '北海道': { lat: 43.0642, lon: 141.3469 },
  '宮城県': { lat: 38.2688, lon: 140.8721 },
  '広島県': { lat: 34.3853, lon: 132.4553 },
  '京都府': { lat: 35.0116, lon: 135.7681 },
  '神奈川県': { lat: 35.4437, lon: 139.6380 },
  '千葉県': { lat: 35.6073, lon: 140.1063 },
  '埼玉県': { lat: 35.8570, lon: 139.6489 },
  '兵庫県': { lat: 34.6913, lon: 135.1830 },
  '静岡県': { lat: 34.9769, lon: 138.3831 },
  '茨城県': { lat: 36.3418, lon: 140.4468 },
  '栃木県': { lat: 36.5658, lon: 139.8836 },
  '群馬県': { lat: 36.3912, lon: 139.0608 },
  '沖縄県': { lat: 26.2124, lon: 127.6809 }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location') || '東京都';

    // 都道府県名から座標を取得
    const coordinates = CITY_COORDINATES[location] || CITY_COORDINATES['東京都'];

    // OpenWeatherMap APIを使用する場合のコード（APIキーが必要）
    if (process.env.OPENWEATHER_API_KEY) {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric&lang=ja`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Weather API error');
      }

      const data = await response.json();
      
      return NextResponse.json({
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: getWindDirection(data.wind.deg),
        condition: mapWeatherCondition(data.weather[0].main),
        cloudCover: data.clouds.all
      });
    }

    // APIキーがない場合は、リアルタイムデータ風のモックデータを返す
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;

    // 季節と時間帯に応じた気温
    let baseTemp = 20;
    if (month >= 12 || month <= 2) baseTemp = 8; // 冬
    else if (month >= 3 && month <= 5) baseTemp = 18; // 春
    else if (month >= 6 && month <= 8) baseTemp = 28; // 夏
    else if (month >= 9 && month <= 11) baseTemp = 20; // 秋

    // 時間による変動
    const hourVariation = Math.sin((hour - 6) * Math.PI / 12) * 5;
    const temperature = Math.round(baseTemp + hourVariation + (Math.random() - 0.5) * 3);

    // その他のデータも季節と時間に応じて生成
    const humidity = Math.round(50 + (Math.random() - 0.5) * 30);
    const pressure = Math.round(1013 + (Math.random() - 0.5) * 20);
    const windSpeed = Math.round(Math.random() * 10);
    const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)];
    
    // 天候条件（季節に応じて）
    const conditions = month >= 6 && month <= 9 
      ? ['clear', 'partly_cloudy', 'cloudy', 'rain'] // 夏は雨が多め
      : ['clear', 'partly_cloudy', 'cloudy']; // その他の季節
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const cloudCover = condition === 'clear' ? Math.random() * 20 
                    : condition === 'partly_cloudy' ? 20 + Math.random() * 40
                    : condition === 'cloudy' ? 60 + Math.random() * 30
                    : 70 + Math.random() * 30;

    return NextResponse.json({
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection,
      condition,
      cloudCover: Math.round(cloudCover)
    });

  } catch (error) {
    console.error('Weather API error:', error);
    
    // エラー時のフォールバック
    return NextResponse.json({
      temperature: 20,
      humidity: 50,
      pressure: 1013,
      windSpeed: 0,
      windDirection: 'N',
      condition: 'clear',
      cloudCover: 0
    });
  }
}

function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function mapWeatherCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    'Clear': 'clear',
    'Clouds': 'cloudy',
    'Rain': 'rain',
    'Drizzle': 'rain',
    'Thunderstorm': 'storm',
    'Snow': 'snow',
    'Mist': 'fog',
    'Fog': 'fog'
  };
  return conditionMap[condition] || 'partly_cloudy';
}