module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier", "prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  plugins: ['prettier'],
  ignorePatterns: ["vite.config.js"],
  rules: {
  //   "prettier/prettier": ["error", {}, {
  //     "usePrettierrc": true
  //   }],
  "quotes": [2, "single", { "avoidEscape": true }],
  //   "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
  //   "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};