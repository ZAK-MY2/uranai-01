export const PREFECTURES = [
  { code: '01', name: '北海道', lat: 43.064310, lon: 141.346874 },
  { code: '02', name: '青森県', lat: 40.824622, lon: 140.740598 },
  { code: '03', name: '岩手県', lat: 39.703619, lon: 141.152667 },
  { code: '04', name: '宮城県', lat: 38.268829, lon: 140.872036 },
  { code: '05', name: '秋田県', lat: 39.718611, lon: 140.102402 },
  { code: '06', name: '山形県', lat: 38.240437, lon: 140.363592 },
  { code: '07', name: '福島県', lat: 37.750300, lon: 140.467522 },
  { code: '08', name: '茨城県', lat: 36.341793, lon: 140.446796 },
  { code: '09', name: '栃木県', lat: 36.566672, lon: 139.883526 },
  { code: '10', name: '群馬県', lat: 36.390669, lon: 139.060459 },
  { code: '11', name: '埼玉県', lat: 35.857431, lon: 139.648890 },
  { code: '12', name: '千葉県', lat: 35.605058, lon: 140.123307 },
  { code: '13', name: '東京都', lat: 35.689487, lon: 139.691711 },
  { code: '14', name: '神奈川県', lat: 35.447495, lon: 139.642347 },
  { code: '15', name: '新潟県', lat: 37.902552, lon: 139.023095 },
  { code: '16', name: '富山県', lat: 36.695291, lon: 137.211341 },
  { code: '17', name: '石川県', lat: 36.594682, lon: 136.625573 },
  { code: '18', name: '福井県', lat: 36.065219, lon: 136.221642 },
  { code: '19', name: '山梨県', lat: 35.664158, lon: 138.568449 },
  { code: '20', name: '長野県', lat: 36.651299, lon: 138.180946 },
  { code: '21', name: '岐阜県', lat: 35.391227, lon: 136.722291 },
  { code: '22', name: '静岡県', lat: 34.976978, lon: 138.383009 },
  { code: '23', name: '愛知県', lat: 35.180344, lon: 136.906566 },
  { code: '24', name: '三重県', lat: 34.730283, lon: 136.508588 },
  { code: '25', name: '滋賀県', lat: 35.004532, lon: 135.868590 },
  { code: '26', name: '京都府', lat: 35.021393, lon: 135.755439 },
  { code: '27', name: '大阪府', lat: 34.686492, lon: 135.519996 },
  { code: '28', name: '兵庫県', lat: 34.691279, lon: 135.183071 },
  { code: '29', name: '奈良県', lat: 34.685334, lon: 135.832745 },
  { code: '30', name: '和歌山県', lat: 34.225987, lon: 135.167509 },
  { code: '31', name: '鳥取県', lat: 35.503868, lon: 134.237716 },
  { code: '32', name: '島根県', lat: 35.472324, lon: 133.050499 },
  { code: '33', name: '岡山県', lat: 34.661772, lon: 133.934406 },
  { code: '34', name: '広島県', lat: 34.396560, lon: 132.459622 },
  { code: '35', name: '山口県', lat: 34.186121, lon: 131.470500 },
  { code: '36', name: '徳島県', lat: 34.065718, lon: 134.559297 },
  { code: '37', name: '香川県', lat: 34.340140, lon: 134.043305 },
  { code: '38', name: '愛媛県', lat: 33.841624, lon: 132.765681 },
  { code: '39', name: '高知県', lat: 33.559706, lon: 133.531080 },
  { code: '40', name: '福岡県', lat: 33.606576, lon: 130.418297 },
  { code: '41', name: '佐賀県', lat: 33.249367, lon: 130.299794 },
  { code: '42', name: '長崎県', lat: 32.744839, lon: 129.873756 },
  { code: '43', name: '熊本県', lat: 32.789816, lon: 130.741669 },
  { code: '44', name: '大分県', lat: 33.238172, lon: 131.612619 },
  { code: '45', name: '宮崎県', lat: 31.911090, lon: 131.423893 },
  { code: '46', name: '鹿児島県', lat: 31.560148, lon: 130.557978 },
  { code: '47', name: '沖縄県', lat: 26.212312, lon: 127.680932 }
];

// 主要都市（都道府県庁所在地）
export const MAJOR_CITIES: Record<string, Array<{ name: string; lat: number; lon: number }>> = {
  '13': [ // 東京都
    { name: '新宿区', lat: 35.689487, lon: 139.691711 },
    { name: '渋谷区', lat: 35.658581, lon: 139.701744 },
    { name: '港区', lat: 35.658083, lon: 139.751491 },
    { name: '千代田区', lat: 35.694003, lon: 139.753595 },
    { name: '中央区', lat: 35.670564, lon: 139.772070 },
    { name: '世田谷区', lat: 35.646832, lon: 139.653184 },
    { name: '台東区', lat: 35.712678, lon: 139.779994 },
    { name: '墨田区', lat: 35.710718, lon: 139.801571 },
    { name: '江東区', lat: 35.673093, lon: 139.817076 },
    { name: '品川区', lat: 35.609192, lon: 139.730102 }
  ],
  '27': [ // 大阪府
    { name: '大阪市', lat: 34.693737, lon: 135.502167 },
    { name: '堺市', lat: 34.573262, lon: 135.483025 },
    { name: '豊中市', lat: 34.784326, lon: 135.469306 },
    { name: '吹田市', lat: 34.759553, lon: 135.515885 },
    { name: '東大阪市', lat: 34.679614, lon: 135.600910 }
  ],
  '14': [ // 神奈川県
    { name: '横浜市', lat: 35.444195, lon: 139.636791 },
    { name: '川崎市', lat: 35.530855, lon: 139.702769 },
    { name: '相模原市', lat: 35.571372, lon: 139.373493 },
    { name: '藤沢市', lat: 35.338994, lon: 139.491001 },
    { name: '鎌倉市', lat: 35.319170, lon: 139.546822 }
  ]
  // 他の都道府県も必要に応じて追加
};

// 県コードから緯度経度を取得
export function getPrefectureLocation(prefectureCode: string): { lat: number; lon: number } | null {
  const prefecture = PREFECTURES.find(p => p.code === prefectureCode);
  return prefecture ? { lat: prefecture.lat, lon: prefecture.lon } : null;
}

// 県名から緯度経度を取得
export function getPrefectureLocationByName(prefectureName: string): { lat: number; lon: number } | null {
  const prefecture = PREFECTURES.find(p => p.name === prefectureName);
  return prefecture ? { lat: prefecture.lat, lon: prefecture.lon } : null;
}