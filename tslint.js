module.exports = {
  extends: [
    "./tslint-base.js",

    // Disable other formatting rules that might conflict with any of these.
    "tslint-react",
    "tslint-config-prettier",
  ],
};
