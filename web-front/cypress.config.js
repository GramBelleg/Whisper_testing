const { defineConfig } = require("cypress");
const codeCoverageTask = require('@cypress/code-coverage/task');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    setupNodeEvents(on, config) {
      // Add the code coverage task
      codeCoverageTask(on, config);
      return config;
    },
    baseUrl: 'http://localhost:5173/',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    env: {
      coverageFolder: '../coverage', // Save coverage data in a shared folder
    },
  },
});
