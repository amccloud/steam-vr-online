module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  env: {
    node: true,
    browser: true,
    es6: true
  },
  plugins: [
    'babel',
    'import',
    'react'
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:react/recommended'
  ],
  rules: {
    'semi': ['error', 'always'],
    'react/react-in-jsx-scope': 'off', // babel-plugin-react-require handles this
    'react/no-danger': 'off'
  },
  settings: {
    'import/resolver': 'webpack'
  }
};
