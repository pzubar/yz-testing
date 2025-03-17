import { singleton } from "tsyringe";
import { ExperimentVariant, Experiment } from "@yz/types/experiment.ts";
import UserIdentityService from "@yz/services/user-identity.ts";
import VariantAssignmentService from "@yz/services/variant-assignment.ts";
import EventTrackerService from "@yz/services/event-tracker.ts";

@singleton()
class ExperimentManager {
  private experiments: Map<string, Experiment> = new Map();

  constructor(
    private eventTracker: EventTrackerService,
    private userIdentity: UserIdentityService,
    private variantAssignment: VariantAssignmentService,
  ) {}

  setExperiments(experiments: Experiment[]) {
    experiments.forEach((experiment) => {
      this.validateExperiment(experiment);
      this.experiments.set(experiment.id, experiment);
    });
  }

  getVariantAndTrack(experimentId: string): ExperimentVariant | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    const userId = this.userIdentity.getUserId();
    if (!userId) return null;

    const variant = this.variantAssignment.getAssignedVariant(
      experiment,
      userId,
    );
    if (!variant) return null;

    this.eventTracker.trackExposure(experimentId, variant.id);

    return variant as ExperimentVariant;
  }

  async trackInteraction(experimentId: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);

    if (!experiment) return;
    const userId = this.userIdentity.getUserId();

    if (!userId) return;
    const variant = this.variantAssignment.getAssignedVariant(
      experiment,
      userId,
    );

    if (!variant) return;

    await this.eventTracker.trackInteraction(experimentId, variant.id);
  }

  private validateExperiment(experiment: Experiment) {
    const error = "Invalid experiment";

    if (
      !experiment ||
      !experiment.id ||
      !Array.isArray(experiment.variants) ||
      !experiment.variants.length
    )
      throw new Error(error);
    if (experiment.variants.reduce((sum, v) => sum + v.weight, 0) !== 100)
      throw new Error(error);
    if (experiment.variants.some((v) => !v.value || !v.id))
      throw new Error(error);
  }
}

export default ExperimentManager;
