import { injectable } from "tsyringe";
import { Event, ExposureEvent, InteractionEvent } from "../types/event.ts";
import { EventLogger } from "./event-logger.ts";

@injectable()
class EventTracker {
  constructor(private eventLogger: EventLogger) {}

  async trackExposure(experimentId: string, variantId: string): Promise<void> {
    const event: ExposureEvent = {
      eventType: Event.EXPOSURE,
      experimentId,
      variant: variantId,
      timestamp: Date.now(),
    };

    await this.eventLogger.logEvent(event);
  }

  async trackInteraction(
    experimentId: string,
    variantId: string,
  ): Promise<void> {
    const event: InteractionEvent = {
      eventType: Event.INTERACTION,
      experimentId,
      variant: variantId,
      timestamp: Date.now(),
    };

    await this.eventLogger.logEvent(event);
  }
}

export default EventTracker;
