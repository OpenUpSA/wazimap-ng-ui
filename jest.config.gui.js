const config = {
  preset: "jest-puppeteer",
  testRegex: "(/__tests__/gui/.*(\\.|/)(test|spec))\\.[jt]sx?$",
  testTimeout: 20*1000*1000,
  setupFilesAfterEnv: [
    "./jest.setup.gui.js"
  ]
};

module.exports = config;
