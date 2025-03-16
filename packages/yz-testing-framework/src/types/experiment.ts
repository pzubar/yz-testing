export interface ExperimentVariant {
  id: string;
  weight: number;
  value: unknown;
}

export interface Experiment {
  id: string;
  variants: ExperimentVariant[];
}
