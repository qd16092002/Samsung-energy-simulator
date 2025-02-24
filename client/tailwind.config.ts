import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '0px',
      'sm': '600px',
      'md': '900px',
      'lg': '1200px',
      'xl': '1536px',
    },
    fontSize: {
      'xs': ['0.75rem', { /* 12px */
        lineHeight: '1rem', /* 16px */
      }],
      'sm': ['0.875rem', { /* 14px */
        lineHeight: '1.25rem', /* 20px */
      }],
      'base': ['1rem', { /* 16px */
        lineHeight: '1.5rem', /* 24px */
      }],
      'lg': ['1.125rem', { /* 18px */
        lineHeight: '1.75rem', /* 28px */
      }],
      'xl': ['1.25rem', { /* 20px */
        lineHeight: '1.75rem', /* 28px */
      }],
      '2xl': ['1.5rem', { /* 24px */
        lineHeight: '2rem', /* 32px */
      }],
      '3xl': ['1.875rem', { /* 30px */
        lineHeight: '2.25rem', /* 36px */
      }],
      '4xl': ['2.25rem', { /* 36px */
        lineHeight: '2.5rem', /* 40px */
      }],
      '5xl': ['3rem', { /* 48px */
        lineHeight: '1rem',
      }],
      '6xl': ['3.75rem', { /* 60px */
        lineHeight: '1',
      }],
      '7xl': ['4.5rem', { /* 72px */
        lineHeight: '1',
      }],
      '8xl': ['6rem', { /* 96px */
        lineHeight: '1',
      }],
      '9xl': ['8rem', { /* 128px */
        lineHeight: '1rem',
      }],
    },
    colors: {
      transparent: 'transparent',
      white: '#fff',
      grey: {
        c900: '#1F1F1F',
        c800: '#333333',
        c700: '#7783A1',
        c600: '#2A2C2F',
        c500: '#878787',
        c400: '#ACACAC',
        c300: '#C7C7C7',
        c200: '#F1F1F1',
        c100: '#D0D5DD',
        c50: '#F9F9F9',
      },
      primary: {
        c900: '#29A587',
        c800: '#5C8D7A',
        c700: '#8FD0C0',
        c600: '#88B6A0',
        c500: '#2582F3',
        c400: '#9FB2CA',
        c300: '#BAC4E5',
        c200: '#D1F0EC',
        c100: '#E0F8F6',
        c50: '#F0FFFB',
      },
      secondary: {
        c900: '#904432',
        c800: '#CA5E42',
        c700: '#FF8A69',
        c600: '#FB967A',
        c500: '#FFA88F',
        c400: '#FFB39D',
        c300: '#FFC2B0',
        c200: '#FFD2C6',
        c100: '#FFE5E0',
        c50: '#FFF1EE',
      },
      support: {
        c900: '#F30000',
        c800: '#FF7183',
        c700: '#FF8D9C',
        c600: '#FFABC2',
        c500: '#FFBFD5',
        c400: '#FFD3E0',
        c300: '#FFE6F0',
        c200: '#FFF1F5',
        c100: '#FFF7FB',
        c50: '#FFFBFE',
      },
      success: {
        c900: '#1B5E20',
        c800: '#2E7D32',
        c700: '#388E3C',
        c600: '#43A047',
        c500: '#4CAF50',
        c400: '#66BB6A',
        c300: '#81C784',
        c200: '#A5D6A7',
        c100: '#C8E6C9',
        c50: '#E8F5E9',
      },
      yellow: {
        c900: '#D6A641',
        c800: '#E9B831',
        c700: '#FFCD20',
        c600: '#F9C50E',
        c500: '#FCDC6E',
        c400: '#FFE488',
        c300: '#FFEBA7',
        c200: '#FFF0BC',
        c100: '#FFF3CA',
        c50: '#FFF8DE',
      },
      overlay: '#000000',
    },
    extend: {
      width: {
        'square': 'calc(200vh)', 
      },
      height: {
        'square': 'calc(80vw)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
      },
      boxShadow: {
        'custom-shadow': '10px 0px 10px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        thin: ["thin", "thin"],
        extralight: ["extralight", "extralight"],
        light: ["light", "light"],
        normal: ["normal", "normal"],
        medium: ["medium", "light"],
        semibold: ["semibold", "semibold"],
        bold: ["bold", "bold"],
        extrabold: ["extrabold", "extrabold"],
        blackbold: ["blackbold", "blackbold"],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        pulse: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.2' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {

    })
  ]
}
export default config