import { readFileSync, existsSync } from "fs";
import { splitLinks } from "./sitemap-parsers";
import { logger } from "./logger";
import { configType } from "./types";
import { OptionValues } from "commander";

//in string format because of commanderJS option format requirement
const defaultTimeout = "5000";
const defaultParallel = "2";

const sitesInput = (filePath: string): string[] => {
  if (filePath) {
    if (existsSync(filePath)) {
      try {
        const data = readFileSync(filePath, { encoding: "utf-8", flag: "r" });
        return splitLinks(data);
      } catch (error) {
        logger.log("error", `Error reading file, error: ${error}`);
        return [];
      }
    } else {
      logger.log("error", `File doesn't exist or invalid path, path: ${filePath}`);
      return [];
    }
  } else {
    return [];
  }
};

const createConfig = (options: any) => {
  const config: configType = {
    pageLoadType: options.pageLoadType,
    requestTimeout: Number(options.requestTimeout),
    utilizeWaitForLoadState: options.waitPageLoad,
    // TODO custom playwrigth headers || add to both fetch and playwright
    // custom headesr --> array
    parallelBlockSize: Number(options.parallel),
    customHeaders: {},
    excludePattern: options.exclude,
    dryRun: options.dry,
    debugMode: options.debug,
    silentRun: options.silent,
    configFilePath: options.configFile,
    sitesFilePath: options.inputFile,
  };

  return config;
};

const pasteConfigFile = (config: configType, customConfigFile: any) => {
  config.pageLoadType = customConfigFile.pageLoadType;
  config.requestTimeout = Number(customConfigFile.requestTimeout);
  config.utilizeWaitForLoadState = customConfigFile.noWaitForLoadState;
  // TODO custom playwrigth headers || add to both fetch and playwright
  // custom headesr --> array
  config.parallelBlockSize = Number(customConfigFile.parallelBlockSize);
  config.customHeaders = {};
  (config.excludePattern = customConfigFile.exclude), (config.dryRun = customConfigFile.dryRun);
  config.debugMode = customConfigFile.debugMode;
  config.silentRun = customConfigFile.silentRun;
  config.configFilePath = customConfigFile.configFilePath;
  config.sitesFilePath = customConfigFile.sitesFilePath;
};

const updateConfig = (config: configType, options: OptionValues, customConfigFile: any) => {
  if (options.requestTimeout !== defaultTimeout) {
    config.requestTimeout = options.requestTimeout;
  } else {
    config.requestTimeout = customConfigFile.requestTimeout;
  }

  if (options.parallel !== defaultParallel) {
    config.parallelBlockSize = options.parallel;
  } else {
    config.parallelBlockSize = customConfigFile.parallelBlockSize;
  }
  if (options.pageLoadType == "document") {
    config.pageLoadType = customConfigFile.pageLoadType;
  } else {
    config.pageLoadType = "network";
  }

  (config.excludePattern = options.exclude ? true : customConfigFile.exclude),
    (config.dryRun = options.dry ? true : customConfigFile.dryRun);
  config.debugMode = options.debug ? true : customConfigFile.debugMode;
  config.silentRun = options.silent ? true : customConfigFile.silentRun;
  config.configFilePath = options.configFile
    ? options.configFile
    : customConfigFile.configFilePath;
  config.sitesFilePath = options.inputFile ? options.inputFile : customConfigFile.sitesFilePath;
};

const checkConfigFile = (config: any, options: OptionValues) => {
  if (options.configFile) {
    if (existsSync(options.configFile)) {
      try {
        const data = readFileSync(options.configFile, { encoding: "utf-8", flag: "r" });
        const customConfigFile = JSON.parse(data);
        updateConfig(config, options, customConfigFile);
      } catch (error) {
        logger.log("error", `Error reading file, error: ${error}`);
      }
    } else {
      logger.log("error", `File doesn't exist or invalid path, path: ${options.configFile}`);
    }
  }
};

export {
  sitesInput,
  createConfig,
  pasteConfigFile,
  checkConfigFile,
  defaultParallel,
  defaultTimeout,
};
