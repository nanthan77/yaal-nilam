import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2f0',
          200: '#b3c4e1',
          300: '#8da6d2',
          400: '#6788c3',
          500: '#416ab4',
          600: '#345290',
          700: '#273a6c',
          800: '#1a2448',
          900: '#0d1224',
          950: '#050809',
        },
        teal: {
          50: '#f0faf9',
          100: '#d4f2f0',
          200: '#a9e5e1',
          300: '#7ed8d2',
          400: '#53cbc3',
          500: '#28beb4',
          600: '#1f9a91',
          700: '#167672',
          800: '#0d5253',
          900: '#042e34',
        },
        sand: {
          50: '#faf8f5',
          100: '#f5f1eb',
          200: '#ebe5d7',
          300: '#e1d9c3',
          400: '#d7cdaf',
          500: '#cdc19b',
          600: '#b8a976',
          700: '#9d8a58',
          800: '#7a6d45',
          900: '#5a5034',
        },
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
          900: '#333333',
        },
        warm: {
          50: '#fef9f3',
          100: '#fdf3e7',
          200: '#fbe7cf',
          300: '#f9dbb7',
          400: '#f5c89f',
          500: '#f1b587',
          600: '#dea26e',
          700: '#cb8f55',
          800: '#b87c3c',
          900: '#a56923',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      spacing: {
        sidebar: '280px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-elevated': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
