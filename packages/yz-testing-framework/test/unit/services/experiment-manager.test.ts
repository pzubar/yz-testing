import { describe, it, expect, vi, beforeEach } from "vitest";
import ExperimentManager from "@yz/services/experiment-manager.ts";
import EventTrackerService from "@yz/services/event-tracker.ts";
import { ExperimentVariant } from "@yz/types/experiment.ts";
import VariantAssignmentService from "@yz/services/variant-assignment.ts";
import UserIdentityService from "@yz/services/user-identity.ts";
import { mockExperiment } from "../../mock-data/experiments.mock.ts";

const mockExposeTracker = vi.fn();
const mockInteractionTracker = vi.fn();

const eventTrackerMock: Partial<EventTrackerService> = {
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

describe("ExperimentManager", () => {
  let experimentManager: ExperimentManager;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    experimentManager = new ExperimentManager(
      eventTrackerMock as EventTrackerService,
      { getUserId: () => "user-123" } as UserIdentityService, // Mock user ID service
      variantAssignmentMock as VariantAssignmentService,
    );
  });

  it("should assign a variant and track exposure for an experiment", async () => {
    await experimentManager.setExperiments([mockExperiment]);
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
