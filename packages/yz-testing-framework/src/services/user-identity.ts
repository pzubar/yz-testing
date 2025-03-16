import { inject, singleton } from "tsyringe";
import { type StorageService } from "../types/storage-service.interface.ts";

@singleton()
export class UserIdentityService {
  private readonly USER_ID_KEY = "yz-user-id";

  constructor(@inject("Storage") private storage: StorageService) {}

  getUserId(): string {
    const storedUserId = this.storage.load<string>(this.USER_ID_KEY);

    if (storedUserId) return storedUserId;

    const newId = this.generateUserId();
    this.saveUserId(newId);
    return newId;
  }

  private saveUserId(id: string): void {
    this.storage.save(this.USER_ID_KEY, id);
  }

  private generateUserId(): string {
    return crypto.randomUUID();
  }
}
