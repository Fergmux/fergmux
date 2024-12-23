module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        out: '0 0 8px 1px rgba(0 0 0 0.15)',
      },
      dropShadow: {
        '3xl': '0px 0px 5px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        mint: {
          100: '#0B132B',
          200: '#141C36',
          300: '#1C2541',
          400: '#2B3B56',
          500: '#3A506B',
          600: '#4B8895',
          700: '#5BC0BE',
          800: '#65E0D4',
          900: '#6FFFE9',
        },
      },
      gridTemplateColumns: {
        20: 'repeat(20, minmax(0, 1fr))',
      },
      width: {
        128: '32rem',
        144: '36rem',
        160: '40rem',
        176: '44rem',
        192: '48rem',
        208: '52rem',
        224: '56rem',
        240: '60rem',
        256: '64rem',
      },
    },
  },
  plugins: [],
}
