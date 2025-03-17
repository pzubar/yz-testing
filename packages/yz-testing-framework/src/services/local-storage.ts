import { type StorageService } from "@yz/types/storage-service.interface.ts";

class LocalStorageService implements StorageService {
  storage: Storage;

  constructor() {
    this.storage = window?.localStorage;
  }

  save<T>(key: string, data: T): void {
    try {
      this.storage.setItem(key, JSON.stringify(data));
    } catch {
      // noop
    }
  }

  load<T>(key: string): T | null {
    try {
      const data = this.storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

export default LocalStorageService;
