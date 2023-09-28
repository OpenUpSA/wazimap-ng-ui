const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "snuts2",

  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:1234",
    specPattern: "./__tests__/**/*.{feature,features}",
  }
});
