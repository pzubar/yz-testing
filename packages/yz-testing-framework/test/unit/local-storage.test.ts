import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorageService } from "../../src/services/local-storage";

describe("LocalStorageService", () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    localStorageService = new LocalStorageService();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("should save a value to localStorage", () => {
    const key = "test-key";
    const value = "test-value";

    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    localStorageService.save(key, value);
    expect(setItemSpy).toHaveBeenCalledWith(key, JSON.stringify(value));
    expect(localStorage.getItem(key)).toBe(JSON.stringify(value));
  });

  it("should retrieve a value from localStorage", () => {
    const key = "test-key";
    const value = "test-value";

    // Set a value in localStorage directly
    localStorage.setItem(key, JSON.stringify(value));

    // Retrieve the value using the service
    const result = localStorageService.load(key);

    // Assert the retrieved value is correct
    expect(result).toBe(value);
  });

  it("should return null for non-existent keys", () => {
    const key = "non-existent-key";

    // Retrieve a non-existent key
    const result = localStorageService.load(key);

    // Assert that null is returned
    expect(result).toBeNull();
  });

  it("should handle exceptions when loading fails", () => {
    const key = "test-key";

    // Mock getItem to throw an error
    const error = new Error("Failed to access localStorage");
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw error;
    });

    // Spy on console.error to check if the error is logged

    // Attempt to load a value
    const result = localStorageService.load(key);

    // Assert that `null` is returned when an error occurs
    expect(result).toBeNull();
  });
});
