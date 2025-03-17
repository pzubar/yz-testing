export interface YZTestingConfig {
  /** Custom user ID for manual user identification, i.e. the id from the database  */
  userId?: string;

  /** Base URL for the API endpoints (defaults to https://httpbin.org) */
  apiEndpoint?: string;

  /** API request timeout (defaults to 5000) */
  requestTimeoutMs?: number;
}
