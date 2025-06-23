import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic Medium', '游ゴシック Medium', 'YuGothic', '游ゴシック体', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        'cosmic-drift': 'cosmicDrift 45s infinite ease-in-out',
        'gentle-float': 'gentleFloat 20s infinite ease-in-out',
        'rotate-slow': 'rotateSlow 60s infinite linear',
      },
      keyframes: {
        cosmicDrift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0) scale(1)' },
          '25%': { transform: 'translateX(-20px) translateY(-30px) scale(1.02)' },
          '50%': { transform: 'translateX(10px) translateY(-20px) scale(0.98)' },
          '75%': { transform: 'translateX(-10px) translateY(-10px) scale(1.01)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config