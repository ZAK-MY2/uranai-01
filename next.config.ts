import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintエラーを無視（ワーニングとして扱う）
    ignoreDuringBuilds: true,
  },
  // パフォーマンス最適化
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 画像最適化設定
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 不要なファイルをバンドルから除外
  webpack: (config, { isServer }) => {
    // クライアントサイドでのみ、不要なパッケージを外部化
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // swissephのバイナリファイルを外部化
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });
    
    // swissephを外部依存として扱う
    if (isServer) {
      config.externals = [
        ...config.externals,
        ({ request }: { request: string }, callback: (err?: Error | null, result?: string) => void) => {
          if (request === 'swisseph') {
            return callback(null, 'commonjs swisseph');
          }
          callback();
        },
      ];
    }

    return config;
  },
  async headers() {
    // 開発環境ではCSPを無効化
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: blob: https://fonts.gstatic.com https://fonts.googleapis.com 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co https:",
              "frame-ancestors 'none'",
              "base-uri 'self'"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default withBundleAnalyzer(nextConfig);
