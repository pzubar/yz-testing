import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import EventLoggerService from "@yz/services/event-logger.ts";
import FetchApiService from "@yz/services/fetch-api.ts";
import LocalStorageService from "@yz/services/local-storage.ts";
import ConfigurationService from "@yz/services/config.ts";

describe("UserIdentityService", () => {
  let eventLogger: EventLoggerService;
  const mockURL = "https://httpbin.org/post";
  const mockFetch = vi.fn(() => {
    return Promise.resolve({
      ok: true,
      status: 200,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: () => Promise.resolve(),
    });
  });
  global.fetch = mockFetch;

  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockClear();
    eventLogger = new EventLoggerService(
      new FetchApiService(new ConfigurationService()),
      new LocalStorageService(),
    );
  });

  afterEach(() => {
    eventLogger.destroy();
    vi.useRealTimers();
  });

  it("should batch and send events every 5 seconds", async () => {
    eventLogger.logEvent({ event: "event-1" });
    eventLogger.logEvent({ event: "event-2" });

    await vi.advanceTimersByTimeAsync(5000);
    // Expect fetch to be called once with the batched events
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      mockURL,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([{ event: "event-1" }, { event: "event-2" }]),
      }),
    );
  });

  it("should queue events while offline and send them when online", async () => {
    eventLogger.logEvent({ event: "event-1" });
    eventLogger.logEvent({ event: "event-2" });
    window.dispatchEvent(new Event("offline"));

    vi.advanceTimersByTime(5000);
    expect(mockFetch).toHaveBeenCalledTimes(0);

    Object.defineProperty(navigator, "onLine", { value: true });
    window.dispatchEvent(new Event("online"));
    vi.advanceTimersByTime(5000);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      mockURL,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([{ event: "event-1" }, { event: "event-2" }]),
      }),
    );
  });
});
