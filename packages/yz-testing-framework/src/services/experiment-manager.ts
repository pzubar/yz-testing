import { singleton } from "tsyringe";
import { ExperimentVariant, Experiment } from "../types/experiment.ts";
import { UserIdentityService } from "./user-identity.ts";
import { VariantAssignmentService } from "./variant-assignment.ts";
import { EventTracker } from "./event-tracker.ts";

@singleton()
export class ExperimentManager {
  private experiments: Map<string, Experiment> = new Map();

  constructor(
    private eventTracker: EventTracker,
    private userIdentity: UserIdentityService,
    private variantAssignment: VariantAssignmentService,
  ) {}

  async initializeExperiments(experiments: Experiment[]): Promise<void> {
    experiments.forEach((experiment) => {
      this.experiments.set(experiment.id, experiment);
    });
  }

  getVariantAndTrack(experimentId: string): ExperimentVariant | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    const variant = this.variantAssignment.getAssignedVariant(
      experiment,
      this.userIdentity.getUserId(),
    );
    if (!variant) return null;

    this.eventTracker.trackExposure(experimentId, variant.id);

    return variant as ExperimentVariant;
  }

  async trackInteraction(experimentId: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);

    if (!experiment) return;

    const variant = this.variantAssignment.getAssignedVariant(
      experiment,
      this.userIdentity.getUserId(),
    );

    if (!variant) return;

    await this.eventTracker.trackInteraction(experimentId, variant.id);
  }

  async getExperiment(experimentId: string): Promise<Experiment | null> {
    return this.experiments.get(experimentId) ?? null;
  }
}
