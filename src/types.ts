interface configType {
  requestTimeout: number;
  pageLoadType: "document" | "network";
  utilizeWaitForLoadState: boolean;
  customHeaders: Record<string, string>;
}

export { configType };
