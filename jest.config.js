module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleFileExtensions: ["js", "json", "vue"],
  setupFiles: ["<rootDir>/__tests__/config/setup.js"],
  transform: {
    ".*\\.(vue)$": "vue-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testMatch: [
    "**/__tests__/tests/**/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  verbose: true
};
