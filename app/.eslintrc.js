module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'airbnb/hooks'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-hooks'],
  rules: {
    'arrow-parens': 'warn',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'warn',
    'import/prefer-default-export': 0,
    'max-len': 'warn',
    'no-multiple-empty-lines': 'warn',
    'object-curly-newline': 'warn',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-indent': 'warn',
    'react/jsx-one-expression-per-line': 0, // Buggy
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/control-has-associated-label': 'warn',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/alt-text': 'off',
    'react/prop-types': 'warn',
    'comma-dangle': [0, 'always-multiline'],
    indent: 'warn',
    semi: 'warn',
  },
};
