#!/usr/bin/env python3
"""Update Tailwind config with green/gold theme"""

content = """import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Forest Green (Primary) — replaces navy
        navy: {
          50: '#f0f7f4',
          100: '#d4ebe2',
          200: '#a9d7c5',
          300: '#7ec3a8',
          400: '#53af8b',
          500: '#2D7A5F',
          600: '#24634D',
          700: '#1B4D3E',
          800: '#133830',
          900: '#0F2E25',
          950: '#081710',
        },
        // Emerald Green (Accent Green) — replaces teal
        teal: {
          50: '#f0faf5',
          100: '#d4f2e4',
          200: '#a9e5c9',
          300: '#7ed8ae',
          400: '#53cb93',
          500: '#2D7A5F',
          600: '#24634D',
          700: '#1B4D3E',
          800: '#133830',
          900: '#0A2319',
        },
        // Gold (Accent) — replaces warm
        warm: {
          50: '#fdf9ef',
          100: '#fbf0d5',
          200: '#f5e0ab',
          300: '#EFD081',
          400: '#E8C97A',
          500: '#D4A853',
          600: '#B8903A',
          700: '#9A7830',
          800: '#7C6026',
          900: '#5E481C',
        },
        // Sand (Backgrounds) — warm white
        sand: {
          50: '#FAFAF8',
          100: '#F5F3EE',
          200: '#EBE7DD',
          300: '#E1DBCC',
          400: '#D7CFBB',
          500: '#CDC3AA',
          600: '#B8A985',
          700: '#9D8A60',
          800: '#7A6D4A',
          900: '#5A5036',
        },
        // Charcoal (Text) — unchanged
        charcoal: {
          50: '#f8f8f8',
          100: '#f1f1f1',
          200: '#e3e3e3',
          300: '#d5d5d5',
          400: '#b8b8b8',
          500: '#9b9b9b',
          600: '#7e7e7e',
          700: '#616161',
          800: '#4a4a4a',
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Tamil', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-lg': '0 10px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
        'card-xl': '0 20px 50px rgba(0,0,0,0.12)',
        'float': '0 4px 20px rgba(27,77,62,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
export default config
"""

target = '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/tailwind.config.ts'
with open(target, 'w', encoding='utf-8') as f:
    f.write(content)

with open(target, 'r') as f:
    written = f.read()
print(f"Tailwind config written: {len(written)} chars, {written.count(chr(10))} lines")
print(f"Green colors present: {'1B4D3E' in written}")
print(f"Gold colors present: {'D4A853' in written}")
