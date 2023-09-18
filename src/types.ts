interface configType {
  requestTimeout: number;
  pageLoadType: "document" | "network";
  utilizeWaitForLoadState: boolean;
  parallelBlockSize: number; // 0 or 1 for non parallel mode
  customHeaders: Record<string, string>;

  dryRun: boolean;
  debugMode: boolean;
  silentRun: boolean;

  excludePattern: RegExp;
  configFilePath: string; //problem pri tvoreni
  sitesFilePath: string;
}

export { configType };
