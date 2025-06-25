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
        sans: ['Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic Medium', '游ゴシック Medium', 'YuGothic', '游ゴシック体', 'sans-serif'],
      },
      fontWeight: {
        'ultra-light': '100',
        'extra-light': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semi-bold': '600',
        'bold': '700',
      },
      letterSpacing: {
        'cosmic': '0.08em',
        'wide': '0.05em',
        'normal': '0.025em',
      },
      spacing: {
        // 8px grid system
        '1': '0.125rem', // 2px
        '2': '0.25rem',  // 4px
        '3': '0.5rem',   // 8px
        '4': '0.75rem',  // 12px
        '5': '1rem',     // 16px
        '6': '1.25rem',  // 20px
        '7': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '9': '2.5rem',   // 40px
        '10': '3rem',    // 48px
        '11': '3.5rem',  // 56px
        '12': '4rem',    // 64px
        '16': '5rem',    // 80px
        '20': '6rem',    // 96px
        '24': '8rem',    // 128px
      },
      borderRadius: {
        'cosmic': '1.5rem',   // 24px
        'cosmic-lg': '2rem',  // 32px
        'cosmic-xl': '2.5rem', // 40px
      },
      animation: {
        'cosmic-drift': 'cosmicDrift 45s infinite ease-in-out',
        'gentle-float': 'gentleFloat 25s infinite ease-in-out',
        'gentle-float-delayed': 'gentleFloat 30s infinite ease-in-out 5s',
        'rotate-slow': 'rotateSlow 60s infinite linear',
        'pulse-gentle': 'pulseGentle 4s infinite ease-in-out',
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
      },
      backdropBlur: {
        'cosmic': '20px',
        'cosmic-strong': '40px',
      },
      boxShadow: {
        'cosmic': '0 8px 32px rgba(139, 92, 246, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
        'cosmic-hover': '0 16px 64px rgba(139, 92, 246, 0.25), 0 4px 16px rgba(0, 0, 0, 0.3)',
        'glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-strong': 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 16px 64px rgba(0, 0, 0, 0.15)',
      },
      colors: {
        cosmic: {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          accent: '#a855f7',
          background: {
            primary: 'rgba(15, 23, 42, 0.85)',
            secondary: 'rgba(30, 41, 59, 0.75)',
            glass: 'rgba(255, 255, 255, 0.03)',
            'glass-strong': 'rgba(255, 255, 255, 0.06)',
          },
          border: {
            light: 'rgba(255, 255, 255, 0.08)',
            medium: 'rgba(255, 255, 255, 0.12)',
            strong: 'rgba(255, 255, 255, 0.18)',
          }
        }
      },
      keyframes: {
        cosmicDrift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0) scale(1)' },
          '25%': { transform: 'translateX(-20px) translateY(-30px) scale(1.02)' },
          '50%': { transform: 'translateX(10px) translateY(-20px) scale(0.98)' },
          '75%': { transform: 'translateX(-10px) translateY(-10px) scale(1.01)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.01)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
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