import { injectable } from "tsyringe";
import { Event, ExposureEvent, InteractionEvent } from "@yz/types/event.ts";
import EventLoggerService from "@yz/services/event-logger.ts";

@injectable()
class EventTrackerService {
  constructor(private eventLogger: EventLoggerService) {}

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

export default EventTrackerService;
