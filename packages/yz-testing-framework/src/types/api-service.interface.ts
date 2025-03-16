export interface ApiService {
  post<T>(url: string, body?: unknown): Promise<T>;
}
