const chalk = require("chalk");

const logger = {
  info: (message, data = null) => {
    console.log(chalk.blue("[INFO]"), message, data || "");
  },

  success: (message, data = null) => {
    console.log(chalk.green("[SUCCESS]"), message, data || "");
  },

  warn: (message, data = null) => {
    console.log(chalk.yellow("[WARN]"), message, data || "");
  },

  error: (message, error = null) => {
    console.log(chalk.red("[ERROR]"), message);
    if (error) console.log(chalk.red(error.stack || error));
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      console.log(chalk.gray("[DEBUG]"), message, data || "");
    }
  },
};

module.exports = logger;
