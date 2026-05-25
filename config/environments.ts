export const OLD_BASE_URL = process.env.OLD_BASE_URL || "https://jsonplaceholder.typicode.com"; 
export const NEW_BASE_URL = process.env.NEW_BASE_URL || "https://jsonplaceholder.typicode.com";

export const GLOBAL_HEADERS = {
  "Authorization": "Bearer DEFAULT_PRODUCTION_REGRESSION_TOKEN",
  "Content-Type": "application/json",
  "Accept": "application/json"
};

export const GLOBAL_TIMEOUT = 15000; // 15 seconds per API call
export const LATENCY_THRESHOLD_MS = 800; // Flag performance regressions > 800ms