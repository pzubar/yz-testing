import { YZTestingConfig } from "./types/config.ts";
import { Experiment } from "./types/experiment.ts";
import { container } from "tsyringe";
import ExperimentManager from "./services/experiment-manager.ts";
import FetchApiService from "./services/fetch-api.ts";
import ConfigurationService from "./services/config.ts";
import LocalStorageService from "./services/local-storage.ts";

export class YZTesting {
  private isInitialized: boolean = false;
  private experimentManager: ExperimentManager;

  constructor(config: YZTestingConfig) {
    this.setupContainer(config);
    this.experimentManager = container.resolve(ExperimentManager);
  }

  setExperiments(experiments: Array<Experiment>) {
    this.experimentManager.setExperiments(experiments);
    this.isInitialized = true;
  }

  static async init({
    config,
    experiments,
  }: {
    config: YZTestingConfig;
    experiments: Array<Experiment>;
  }) {
    const instance = new YZTesting(config);

    await new Promise((resolve) => setTimeout(resolve, 500)); // simulate async load
    instance.setExperiments(experiments);
    return instance;
  }

  async trackInteraction(experimentId: string): Promise<void> {
    this.ensureInitialized();
    await this.experimentManager.trackInteraction(experimentId);
  }

  getExperimentValue<T>(experimentId: string, fallback?: T): T | null {
    this.ensureInitialized();

    const value = this.experimentManager.getVariantAndTrack(experimentId)
      ?.value as T;
    return value || fallback || null;
  }

  private setupContainer(config: YZTestingConfig): void {
    container.resolve(ConfigurationService).assign(config);
    container.register("ApiClient", { useClass: FetchApiService });
    container.register("Storage", { useClass: LocalStorageService });
  }

  private ensureInitialized(): void {
    if (this.isInitialized) return;

    throw new Error("YZ Testing framework is not initialized");
  }
}

export default YZTesting;
