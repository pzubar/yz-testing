import { Experiment } from "@yz/types/experiment";

export const mockExperiment: Experiment = {
  id: "experiment-1",
  variants: [
    { id: "variant-a", weight: 50, value: "variant-a-value" },
    { id: "variant-b", weight: 50, value: "variant-b-value" },
  ],
};
