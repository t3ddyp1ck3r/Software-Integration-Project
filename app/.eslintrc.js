module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error', // Change to 'error' for stricter type safety
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'warn',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for...in statements are not allowed',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them is discouraged',
      },
      {
        selector: 'WithStatement',
        message: '`with` statements are not allowed',
      },
    ],
  },
};
