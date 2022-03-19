module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    'prettier',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint'],
  ignorePatterns: ['vite.config.js'],
  rules: {
    //   "prettier/prettier": ["error", {}, {
    //     "usePrettierrc": true
    //   }],
    'vue/multi-word-component-names': 0,
    'no-undef': 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    //   "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    //   "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
}
