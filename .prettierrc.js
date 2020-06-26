module.exports = {
  arrowParens: "always",
  bracketSpacing: true,
  printWidth: 100,
  singleQuote: true,
  semi: false,
  tabWidth: 4,
  trailingComma: "all",
  overrides: [
    {
      files: "*.js",
      options: {
        tabWidth: 2,
      },
    },
    {
      files: "*.json",
      options: {
        tabWidth: 2,
      },
    },
    {
      files: ".prettierrc.json",
      options: {
        tabWidth: 2,
      },
    },
    {
      files: "*.jsonc",
      options: {
        tabWidth: 2,
      },
    },
  ],
};
