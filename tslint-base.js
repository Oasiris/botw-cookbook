/**
 * My preferred TSLint rules.
 *
 * Many of these rules will be overwritten by Prettier.
 */

module.exports = {
  extends: ["tslint:recommended"],
  rules: {
    // What I'm used to.
    "interface-name": false,
    "interface-over-type-literal": false,
    "max-classes-per-file": false,
    "member-access": false,
    "member-ordering": false,
    "no-console": false,
    "no-string-literal": false,
    "no-unused-vars": false,
    "object-literal-shorthand": "properties",
    "object-literal-sort-keys": false,
    "one-variable-per-declaration": false,
    radix: false,

    /* Other useful defaults for the project. */

    "array-type": false,
    "ban-comma-operator": true,

    // Overridden by Prettier.
    "linebreak-style": [true, "LF"],

    // Overridden by Prettier.
    semicolon: [true, "never"],

    // Prefer strict equality (=== and !==) over == and !=.
    "triple-equals": true,

    "variable-name": {
      options: [
        // Variable names can't be keywords.
        "ban-keywords",
        // Variable names with leading underscores can be used.
        "allow-leading-underscore",
      ],
    },

    whitespace: [true, "check-rest-spread"],
  },
};
