module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vue-green': '#2c3e50',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        20: 'repeat(20, minmax(0, 1fr))',

        // Complex site-specific column configuration
        // 'footer': '200px minmax(900px, 1fr) 100px',
      },
    },
  },
  plugins: [],
}
