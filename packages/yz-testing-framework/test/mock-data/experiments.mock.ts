import { Experiment } from "../../src/types/experiment";

export const mockExperiment: Experiment = {
  id: "experiment-1",
  variants: [
    {
      id: "variant-a",
      weight: 50,
      value: { type: "string", value: "variant-a-value" },
    },
    { id: "variant-b", weight: 50, value: { type: "number", value: 123 } },
  ],
};
