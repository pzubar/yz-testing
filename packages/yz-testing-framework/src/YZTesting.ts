import { YZTestingConfig } from "./types/config.ts";
import { Experiment } from "./types/experiment.ts";
import { container } from "tsyringe";
import { ExperimentManager } from "./services/experiment-manager.ts";
import { FetchApiService } from "./services/fetch-api.ts";

export class YZTesting {
  private readonly config: YZTestingConfig;
  private isInitialized: boolean = false;
  private experimentManager = container.resolve(ExperimentManager);

  constructor(config: YZTestingConfig) {
    this.config = config;
    this.setupContainer();
  }

  async initialize(experiments: Array<Experiment>) {
    await this.experimentManager.initializeExperiments(experiments);
    this.isInitialized = true;
  }

  async trackInteraction(experimentId: string): Promise<void> {
    this.ensureInitialized();
    await this.experimentManager.trackInteraction(experimentId);
  }

  getExperimentValue<T>(experimentId: string, fallback: T): T {
    this.ensureInitialized();

    return (
      (this.experimentManager.getVariantAndTrack(experimentId)?.value as T) ||
      fallback
    );
  }

  private setupContainer(): void {
    container.register("ApiClient", {
      useValue: new FetchApiService({ baseURL: this.config.apiEndpoint }),
    });
  }

  private ensureInitialized(): void {
    if (this.isInitialized) return;

    throw new Error("YZ Testing framework is not initialized");
  }
}

export default YZTesting;
