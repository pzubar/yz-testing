import { type StorageService } from "../types/storage-service.interface.ts";

export class LocalStorageService implements StorageService {
  storage: Storage;

  constructor() {
    this.storage = window?.localStorage;
  }

  save<T>(key: string, data: T): void {
    this.storage.setItem(key, JSON.stringify(data));
  }

  load<T>(key: string): T | null {
    try {
      const data = this.storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }
}
