const { defineConfig } = require("cypress");
const { fetchResetLink } = require("./email-utils/fetchOldEmail");

module.exports = defineConfig({
  numTestsKeptInMemory: 15,
  defaultCommandTimeout: 15000,
  env: {
    apiUrl: "https://training.bigbyte.academy/api",
    oldApiUrl: "https://conduit.productionready.io/api",
    device: "desktop",
    email: "support@visitorapp.co",
    password: "oJlF^Pza6Tzv",
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
  viewportHeight: 768,
  viewportWidth: 1266,
  e2e: {
    setupNodeEvents(on, config) {
      // Adaugă logica sarcinii personalizate
      on("task", {
        // fetchResetLink: async () => {
        //   try {
        //     const link = await fetchResetLink();
        //     return link; // Return the reset link to the Cypress test
        //   } catch (err) {
        //     throw new Error(`Failed to fetch reset link: ${err.message}`);
        //   }
        // },
      });

      // Păstrează logica existentă, dacă e cazul
      if (require("./cypress/plugins/index.js")) {
        return require("./cypress/plugins/index.js")(on, config);
      }
    },
    baseUrl: "https://app.visitor.de",
    pageLoadTimeout: 18000,
    experimentalOriginDependencies: true
  },
});
