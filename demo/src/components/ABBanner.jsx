import { use } from "react";

let EXPERIMENT_ID = "homepage-banner";

export function ABBanner({ abTestingLibrary }) {
  let abTesting = use(abTestingLibrary);

  if (!abTestingLibrary) return null;

  let value = abTesting.getExperimentValue("homepage-banner");

  if (!value) return null;

  return (
    <div className="banner-container">
      <h2>{value.title}</h2>
      <p>{value.description}</p>
      <button onClick={() => abTesting.trackInteraction(EXPERIMENT_ID)}>
        {value.buttonText}
      </button>
    </div>
  );
}
