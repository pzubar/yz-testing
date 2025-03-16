export interface YZTestingConfig {
  /** Custom user ID for manual user identification */
  userId?: string;

  /** Base URL for the API endpoints (defaults to https://httpbin.org) */
  apiEndpoint?: string;
}
