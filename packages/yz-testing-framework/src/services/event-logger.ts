import { inject, singleton } from "tsyringe";
import { ExperimentEvent, EventResponse } from "@yz/types/event.ts";
import { type ApiService } from "@yz/types/api-service.interface.ts";
import { type StorageService } from "@yz/types/storage-service.interface.ts";

const QUEUE_KEY = "yz-queue";

@singleton()
class EventLoggerService {
  private eventQueue: Array<ExperimentEvent> = [];
  private loggingThreshold = 5000;
  private sendInterval: number | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor(
    @inject("ApiClient") private api: ApiService,
    @inject("Storage") private storage: StorageService,
  ) {
    this.scheduleLogging();
    this.initializeConnectivityListeners();
    this.sendEventsBatch();
  }

  async logEvent(event: ExperimentEvent): Promise<void> {
    this.eventQueue.push(event);
    this.persistQueue();
  }

  destroy(): void {
    this.stopSending();
    window.removeEventListener("online", this.handleOnlineEvent);
    window.removeEventListener("offline", this.handleOfflineEvent);
  }

  private persistQueue(): void {
    this.storage.save(QUEUE_KEY, JSON.stringify(this.eventQueue));
  }

  private async sendEventsBatch(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.isOnline) return;

    const eventsToSend = [...this.eventQueue];

    this.eventQueue = [];
    try {
      const response = await this.api.post<EventResponse>(
        "/post",
        eventsToSend,
      );
      this.validateResponse(response, eventsToSend);
    } catch (error) {
      this.eventQueue = [...eventsToSend, ...this.eventQueue];
      throw error;
    } finally {
      this.persistQueue();
    }
  }

  private scheduleLogging() {
    this.sendInterval = setInterval(() => {
      this.sendEventsBatch();
    }, this.loggingThreshold);
  }

  private initializeConnectivityListeners() {
    window.addEventListener("online", this.handleOnlineEvent);
    window.addEventListener("offline", this.handleOfflineEvent);
  }

  private stopSending() {
    if (!this.sendInterval) return;
    clearInterval(this.sendInterval);
  }

  private handleOnlineEvent = () => {
    this.isOnline = true;
  };

  private handleOfflineEvent = () => {
    this.isOnline = false;
  };

  private validateResponse(
    response: EventResponse,
    eventsToSend: Array<ExperimentEvent>,
  ) {
    if (response.data !== JSON.stringify(eventsToSend))
      throw new Error("Invalid response");
  }
}

export default EventLoggerService;
