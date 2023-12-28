module.exports = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  rules: {
    "vue/no-v-for-template-key": "off",
    "vue/multi-word-component-names": "off",
    "vue/require-default-prop": "off",
    "vue/require-explicit-emits": "off",
    "vue/v-on-event-hyphenation": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": 0
  },

  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2017,
    sourceType: "module"
  },

  ignorePatterns: ["__tests__/*"],

  extends: [
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/prettier",
    "@vue/typescript"
  ]
};
