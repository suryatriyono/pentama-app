const logger = (message) => {
  console.log(`[LOG] ${new Date().toString()}: ${message}`);
};

module.exports = logger;
