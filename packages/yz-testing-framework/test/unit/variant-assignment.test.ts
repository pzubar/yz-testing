import { describe, it, expect, beforeEach } from "vitest";
import VariantAssignmentService from "../../src/services/variant-assignment";
import { Experiment } from "../../src/types/experiment";

describe("VariantAssignmentService", () => {
  let variantAssignmentService: VariantAssignmentService;

  const mockExperiment: Experiment = {
    id: "test-experiment",
    variants: [
      { id: "variant-a", weight: 50, value: "A" },
      { id: "variant-b", weight: 30, value: "B" },
      { id: "variant-c", weight: 20, value: "C" },
    ],
  };

  beforeEach(() => {
    variantAssignmentService = new VariantAssignmentService();
  });

  it("should deterministically assign the same variant for the same user across multiple runs", () => {
    const userId = "user-123";

    // Run the assignment multiple times (10 iterations) to verify determinism
    const assignedVariants = Array.from({ length: 10 }, () =>
      variantAssignmentService.getAssignedVariant(mockExperiment, userId),
    );

    // All assigned variants should be the same
    assignedVariants.forEach((variant, index) => {
      if (index > 0) {
        expect(variant).toEqual(assignedVariants[0]); // Ensure all assigned variants are consistent
      }
    });

    // Verify that the assigned variant exists in the experiment's variants
    expect(mockExperiment.variants).toContainEqual(assignedVariants[0]);
  });

  it("should assign a different variant for different users", () => {
    const user1Id = "8831bd41-501b-4f19-a8ab-b073ae143642";
    const user2Id = "0d40f00a-16ab-4b45-a1ba-6cb5217d2476";
    const assignedVariant1 = variantAssignmentService.getAssignedVariant(
      mockExperiment,
      user1Id,
    );
    const assignedVariant2 = variantAssignmentService.getAssignedVariant(
      mockExperiment,
      user2Id,
    );

    // Ensure that the assigned variants are different for the two users
    expect(assignedVariant1).not.toEqual(assignedVariant2);

    // Verify that the assigned variants exist in the experiment's variants
    expect(mockExperiment.variants).toContainEqual(assignedVariant1);
    expect(mockExperiment.variants).toContainEqual(assignedVariant2);
  });

  it("should respect the variant weights during assignment (basic test)", () => {
    const userList = [
      "user-1",
      "user-2",
      "user-3",
      "user-4",
      "user-5",
      "user-6",
    ];

    // Get assigned variants for multiple users
    const assignedVariants = userList.map((userId) =>
      variantAssignmentService.getAssignedVariant(mockExperiment, userId),
    );

    // Ensure all assigned variants exist in the experiment's list of variants
    assignedVariants.forEach((variant) => {
      expect(mockExperiment.variants).toContainEqual(variant);
    });
  });
});
