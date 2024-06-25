module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Include node environment
  },
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json', // Specify path to your tsconfig.json file
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  settings: {
    react: {
      version: 'detect' // Automatically detect React version
    }
  },
  rules: {
    // Define any additional rules or overrides as needed
  }
};
