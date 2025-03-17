import { describe, it, expect, vi, beforeEach } from "vitest";
import UserIdentityService from "@yz/services/user-identity.ts";
import { type StorageService } from "@yz/types/storage-service.interface";
import ConfigurationService from "@yz/services/config";

describe("UserIdentityService", () => {
  let userIdentityService: UserIdentityService;
  let storageMock: StorageService;
  let configMock: ConfigurationService;
  const USER_ID_KEY = "yz-user-id";
  const MOCK_UUID = "12345678-1234-1234-1234-123456789012";

  beforeEach(() => {
    // Mock the storage service
    storageMock = {
      save: vi.fn(),
      load: vi.fn(),
    };

    // Mock the configuration service
    configMock = {
      userId: null,
      apiEndpoint: "",
      requestTimeoutMs: 5000,
      assign: vi.fn(),
    };

    // Mock crypto.randomUUID
    vi.spyOn(crypto, "randomUUID").mockReturnValue(MOCK_UUID);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should save userId from config if provided", () => {
      const configUserId = "config-user-123";
      configMock.userId = configUserId;
      storageMock.load.mockReturnValue(null);

      new UserIdentityService(storageMock, configMock);

      expect(storageMock.save).toHaveBeenCalledWith(USER_ID_KEY, configUserId);
    });

    it("should generate new userId if none exists in storage", () => {
      storageMock.load.mockReturnValue(null);

      new UserIdentityService(storageMock, configMock);

      expect(storageMock.save).toHaveBeenCalledWith(USER_ID_KEY, MOCK_UUID);
      expect(crypto.randomUUID).toHaveBeenCalled();
    });

    it("should not generate new userId if one already exists in storage", () => {
      const existingUserId = "existing-user-123";
      storageMock.load.mockReturnValue(existingUserId);

      new UserIdentityService(storageMock, configMock);

      expect(crypto.randomUUID).not.toHaveBeenCalled();
      expect(storageMock.save).not.toHaveBeenCalled();
    });
  });

  describe("getUserId", () => {
    it("should return userId from storage", () => {
      const existingUserId = "existing-user-123";
      storageMock.load.mockReturnValue(existingUserId);
      userIdentityService = new UserIdentityService(storageMock, configMock);

      const result = userIdentityService.getUserId();

      expect(result).toBe(existingUserId);
      expect(storageMock.load).toHaveBeenCalledWith(USER_ID_KEY);
    });

    it("should return null if no userId exists", () => {
      storageMock.load.mockReturnValue(null);
      userIdentityService = new UserIdentityService(storageMock, configMock);
      // Clear mocks after construction to test getUserId specifically
      vi.clearAllMocks();

      const result = userIdentityService.getUserId();

      expect(result).toBeNull();
      expect(storageMock.load).toHaveBeenCalledWith(USER_ID_KEY);
    });
  });

  describe("generateUser", () => {
    it("should generate and save new userId", () => {
      userIdentityService = new UserIdentityService(storageMock, configMock);
      vi.clearAllMocks();

      const result = userIdentityService.generateUser();

      expect(result).toBe(MOCK_UUID);
      expect(storageMock.save).toHaveBeenCalledWith(USER_ID_KEY, MOCK_UUID);
      expect(crypto.randomUUID).toHaveBeenCalled();
    });
  });
});
