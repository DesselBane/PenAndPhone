/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ]
}
