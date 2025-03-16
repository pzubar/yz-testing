export interface StorageService {
  save<T>(key: string, data: T): void;
  load<T>(key: string): T | null;
  remove(key: string): void;
}
