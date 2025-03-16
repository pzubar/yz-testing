export enum Event {
  EXPOSURE = "exposure",
  INTERACTION = "interaction",
}

export interface BaseEvent {
  experimentId: string;
  variant: string;
  timestamp: number;
}

export interface ExposureEvent extends BaseEvent {
  eventType: Event.EXPOSURE;
}
export interface InteractionEvent extends BaseEvent {
  eventType: Event.INTERACTION;
}

export type ExperimentEvent = ExposureEvent | InteractionEvent;
