module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "prettier/@typescript-eslint",
  ],
  env: {
      "browser": true,
      "es6": true,
      "node": true
  },
  overrides: [
      {
          "files": ["*.tsx"],
          "rules": {
          }
      },
      {
          "files": ["*.js"],
          "rules": {
              "@typescript-eslint/no-var-requires": "off",
              "@typescript-eslint/no-unused-vars": "warn"              
          }
      }
  ]
}