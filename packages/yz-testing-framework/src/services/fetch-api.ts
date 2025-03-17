import { ApiService } from "@yz/types/api-service.interface.ts";
import { injectable } from "tsyringe";
import ConfigService from "@yz/services/config.ts";

@injectable()
class FetchApiService implements ApiService {
  private readonly baseURL: string;
  private readonly timeoutMs: number;

  constructor(private config: ConfigService) {
    this.baseURL = this.config.apiEndpoint;
    this.timeoutMs = this.config.requestTimeoutMs;
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", url, body);
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutMs = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutMs);

      if (!response.ok) {
        const errorMessage = await this.parseError(response);
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}. ${errorMessage || ""}`,
        );
      }

      return await this.parseResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutMs);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out.");
      }

      throw error;
    }
  }

  /**
   * Parse JSON response if possible.
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    // Return raw text if the content type isn't JSON
    return response.text() as unknown as T;
  }

  /**
   * Extract error details from the response if possible.
   */
  private async parseError(response: Response): Promise<string> {
    try {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return errorData.message || JSON.stringify(errorData);
      }

      return await response.text();
    } catch {
      return "An error occurred but could not retrieve error details.";
    }
  }
}

export default FetchApiService;
