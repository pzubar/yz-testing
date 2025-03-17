import { inject, singleton } from "tsyringe";
import { type StorageService } from "@yz/types/storage-service.interface.ts";
import ConfigurationService from "@yz/services/config.ts";

const USER_ID_KEY = "yz-user-id";

@singleton()
class UserIdentityService {
  constructor(
    @inject("Storage") private storage: StorageService,
    private config: ConfigurationService,
  ) {
    if (this.config.userId) {
      this.saveUserId(this.config.userId);
    }
    if (this.getUserId()) return;

    this.generateUser();
  }

  getUserId(): string | null {
    return this.storage.load<string>(USER_ID_KEY);
  }

  generateUser() {
    const newId = this.generateUserId();
    this.saveUserId(newId);
    return newId;
  }

  private saveUserId(id: string): void {
    this.storage.save(USER_ID_KEY, id);
  }

  private generateUserId(): string {
    return crypto.randomUUID();
  }
}

export default UserIdentityService;
