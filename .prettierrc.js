module.exports = {
  overrides: [
    {
      files: "*.scss",
      /* OR
      files: ["*.scss", "*.css"], */
      options: {
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: true,
        parser: "scss",
      },
    },
  ],
};
