module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        out: '0 0 8px 1px rgb(0 0 0 / 0.15)',
      },
      colors: {
        'mint-100': '#0B132B',
        'mint-200': '#141C36',
        'mint-300': '#1C2541',
        'mint-400': '#2B3B56',
        'mint-500': '#3A506B',
        'mint-600': '#4B8895',
        'mint-700': '#5BC0BE',
        'mint-800': '#65E0D4',
        'mint-900': '#6FFFE9',
      },
      gridTemplateColumns: {
        20: 'repeat(20, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
