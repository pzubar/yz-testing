// services/variant-assignment.service.ts
import { Experiment, ExperimentVariant } from "../types/experiment.ts";
import { singleton } from "tsyringe";

@singleton()
export class VariantAssignmentService {
  /**
   * Assigns a variant to the user for a given experiment. Once a variant is assigned,
   * the same variant will always be returned for that experiment and user combination.
   * @param experiment The experiment for which to assign a variant.
   * @param userId The unique identifier of the user.
   * @returns The assigned experiment variant.
   */
  getAssignedVariant(
    experiment: Experiment,
    userId: string,
  ): ExperimentVariant | null {
    // Use a hash function to consistently map the user to a variant
    const variantHash = this.generateHash(`${userId}:${experiment.id}`);
    const totalWeight = experiment.variants.reduce(
      (sum, variant) => sum + variant.weight,
      0,
    );

    // Deterministically assign a variant based on the hash and weight distribution
    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (variantHash < cumulativeWeight / totalWeight) {
        return variant; // Variant is selected
      }
    }

    return null; // Fallback for edge cases (shouldn't happen if variants are defined correctly)
  }

  /**
   * Hash function to generate a deterministic, pseudo-random number between 0 and 1
   * for a given input string (e.g., `${userId}:${experimentId}`).
   * @param input The input string to hash.
   * @returns A number between 0 (inclusive) and 1 (exclusive).
   */
  private generateHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i); // Hash generation
      hash |= 0; // Convert to 32-bit integer
    }

    // Convert the hash to a number between 0 and 1
    return (hash >>> 0) / 0xffffffff;
  }
}
