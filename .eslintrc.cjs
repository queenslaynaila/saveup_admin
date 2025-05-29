const a11yOff = Object.keys(require("eslint-plugin-jsx-a11y").rules).reduce(
  (acc, rule) => {
    acc[`jsx-a11y/${rule}`] = "off";
    return acc;
  },
  {},
);

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 13,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["react-refresh", "@typescript-eslint"],
  ignorePatterns: [".eslintrc.*", "vite.config.*"],
  rules: {
    ...a11yOff,
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "symbol-description": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/button-has-type": "off",
    "react/function-component-definition": "off",
    "react/no-unescaped-entities": "off",
    "react/require-default-props": "off",
    "consistent-return": "off",
    "guard-for-in": "off",
    "no-restricted-syntax": "off",
    "padding-line-between-statements": ["error", {
      blankLine: "always",
      prev: "*",
      next: [
        "if",
        "for",
        "return",
        "block-like",
        "multiline-const",
        "multiline-expression",
        "export",
      ],
    }, {
      blankLine: "never",
      prev: ["singleline-const", "singleline-let", "singleline-var"],
      next: ["singleline-const", "singleline-let", "singleline-var"],
    }, {
      blankLine: "always",
      prev: [
        "multiline-const",
        "multiline-let",
        "multiline-var",
        "multiline-expression",
      ],
      next: "*",
    }],
  },
};