import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExperimentManager } from "../../src/services/experiment-manager";
import { EventTracker } from "../../src/services/event-tracker";
import { ExperimentVariant } from "../../src/types/experiment";
import { VariantAssignmentService } from "../../src/services/variant-assignment";
import { UserIdentityService } from "../../src/services/user-identity";
import { mockExperiment } from "../mock-data/experiments.mock";

const mockExposeTracker = vi.fn();
const mockInteractionTracker = vi.fn();

const eventTrackerMock: Partial<EventTracker> = {
  trackExposure: mockExposeTracker,
  trackInteraction: mockInteractionTracker,
};

const mockAssignedVariant: ExperimentVariant = {
  id: "variant-a",
  weight: 50,
  value: { type: "string", value: "variant-a-value" },
};

const variantAssignmentMock: Partial<VariantAssignmentService> = {
  getAssignedVariant(): ExperimentVariant | null {
    return mockAssignedVariant;
  },
};

// Tests
describe("ExperimentManager", () => {
  let experimentManager: ExperimentManager;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    experimentManager = new ExperimentManager(
      eventTrackerMock as EventTracker,
      { getUserId: () => "user-123" } as UserIdentityService, // Mock user ID service
      variantAssignmentMock as VariantAssignmentService,
    );
  });

  it("should initialize experiments", async () => {
    await experimentManager.initializeExperiments([mockExperiment]);

    const activeExperiment = await experimentManager.getExperiment(
      mockExperiment.id,
    );

    expect(activeExperiment).toEqual(mockExperiment);
  });

  it("should assign a variant and track exposure for an experiment", async () => {
    await experimentManager.initializeExperiments([mockExperiment]);
    const result = await experimentManager.getVariantAndTrack(
      mockExperiment.id,
    );

    expect(result).toBe(mockAssignedVariant);
    expect(mockExposeTracker).toHaveBeenCalledTimes(1);
    expect(mockExposeTracker).toHaveBeenCalledWith(
      mockExperiment.id,
      mockAssignedVariant.id,
    );
  });
});
