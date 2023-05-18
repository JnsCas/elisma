module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended', // default javascript best-practice rules
    'plugin:prettier/recommended', // use eslint-plugin-prettier and eslint-config-prettier,
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'off',
    'no-prototype-builtins': 'off',
    'require-atomic-updates': 'off',
    'filenames/match-exported': 'off',
    'no-useless-escape': 'warn',
    'prettier/prettier': 'error',
  },
}
