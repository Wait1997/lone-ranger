/**
 * "off"或0- 关闭规则
 * "warn"或1- 开启规则，使用警告级别的错误：warn(不会导致程序退出)
 * "error"或2- 开启规则，使用错误级别的错误：error(当被触发的时候，程序会退出)
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard-with-typescript',
    'prettier',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  plugins: ['prettier', 'react', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': ['error', { arrowParens: 'always' }], // 开启prettier的自我修复功能
    '@typescript-eslint/explicit-function-return-type': 'off', // 要求函数必须标注返回类型
    'react/react-in-jsx-scope': 'off', // 现在已经不需要在文件顶部引入import react from react
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/promise-function-async': 'off',
    'prefer-promise-reject-errors': 'warn',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    'no-debugger': 'warn'
  }
};
