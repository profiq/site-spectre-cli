import {
  sitesInput,
  createConfig,
  pasteConfigFile,
  checkConfigFile,
  defaultParallel,
  defaultTimeout,
} from "../src/cli-inputs";

describe("cli-inputs", () => {
  describe("sitesInput", () => {
    it("should return an empty array if filePath is falsy", () => {
      expect(sitesInput("")).toEqual([]);
    });

    it("should return an empty array if filePath does not exist", () => {
      expect(sitesInput("nonexistent-file.txt")).toEqual([]);
    });

    // Add more test cases for different scenarios
  });

  describe("createConfig", () => {
    it("should create a config object with the correct properties", () => {
      const options = {
        pageLoadType: "document",
        requestTimeout: "10000",
        waitPageLoad: true,
        parallel: "4",
        exclude: "pattern",
        dry: true,
        debug: false,
        silent: false,
        configFile: "config.json",
        inputFile: "sites.txt",
      };

      const config = createConfig(options);

      expect(config.pageLoadType).toBe(options.pageLoadType);
      expect(config.requestTimeout).toBe(Number(options.requestTimeout));
      expect(config.utilizeWaitForLoadState).toBe(options.waitPageLoad);
      expect(config.parallelBlockSize).toBe(Number(options.parallel));
      expect(config.excludePattern).toBe(options.exclude);
      expect(config.dryRun).toBe(options.dry);
      expect(config.debugMode).toBe(options.debug);
      expect(config.silentRun).toBe(options.silent);
      expect(config.configFilePath).toBe(options.configFile);
      expect(config.sitesFilePath).toBe(options.inputFile);
    });

    // Add more test cases for different scenarios
  });

  // Add more test cases for the remaining functions
});
