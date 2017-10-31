module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  env: {
    browser: true,
    jasmine: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/prop-types": "off",
    "prettier/prettier": "error",
  },
  "plugins": [
    "react",
    "prettier",
  ],
};
