import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cosmic-oracle.vercel.app';
  
  // 占術タイプ一覧
  const divinationTypes = [
    'numerology',
    'tarot',
    'astrology',
    'iching',
    'shichu-suimei',
    'nine-star-ki',
    'runes',
    'kabbalah',
    'celtic',
    'vedic',
    'integrated'
  ];

  // 静的ページ
  const staticPages = [
    '',
    '/entry',
    '/login',
    '/input'
  ];

  // 静的ページのサイトマップエントリー
  const staticEntries = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }));

  // 占術ページのサイトマップエントリー
  const divinationEntries = divinationTypes.map(type => ({
    url: `${baseUrl}/divination/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...divinationEntries];
}