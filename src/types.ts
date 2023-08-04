interface configType {
  requestTimeout: number;
  pageLoadType: "document" | "network";
  utilizeWaitForLoadState: boolean;
  parallelBlockSize: number;
  customHeaders: Record<string, string>;
}

export { configType };
