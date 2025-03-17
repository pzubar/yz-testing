import { describe, it, expect, vi, beforeEach } from "vitest";
import EventTrackerService from "@yz/services/event-tracker";
import EventLoggerService from "@yz/services/event-logger";

describe("EventTrackerService", () => {
  let eventTrackerService: EventTrackerService;
  let eventLoggerService: EventLoggerService;

  beforeEach(() => {
    eventLoggerService = {
      logEvent: vi.fn(),
    };
    eventTrackerService = new EventTrackerService(eventLoggerService);
  });

  describe("trackExposure", () => {
    it("should track experiment exposure successfully", async () => {
      const experimentId = "test-experiment";
      const variantId = "variant-a";

      await eventTrackerService.trackExposure(experimentId, variantId);

      expect(eventLoggerService.logEvent).toHaveBeenCalledWith({
        eventType: "exposure",
        experimentId,
        variant: variantId,
        timestamp: expect.any(Number),
      });
    });
  });

  describe("trackInteraction", () => {
    it("should track experiment interaction successfully", async () => {
      const experimentId = "test-experiment";
      const variantId = "variant-a";

      await eventTrackerService.trackInteraction(experimentId, variantId);

      expect(eventLoggerService.logEvent).toHaveBeenCalledWith({
        eventType: "interaction",
        experimentId,
        variant: variantId,
        timestamp: expect.any(Number),
      });
    });
  });
});
