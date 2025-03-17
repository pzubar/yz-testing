import { Suspense } from "react";
import { YZTesting } from "@pzubar/yz-testing-framework";
import { bannerExperiment } from "./config/experiments.js";
import { BannerPlaceholder } from "./components/BannerPlaceholder.jsx";
import { ABBanner } from "./components/ABBanner.jsx";
import "./App.css";

let abTestingLibrary = YZTesting.init({ experiments: [bannerExperiment] });

function App() {
  return (
    <>
      <Suspense fallback={<BannerPlaceholder />}>
        <ABBanner abTestingLibrary={abTestingLibrary} />
      </Suspense>
      <h1>Welcome to YZ testing library demo 👋</h1>
    </>
  );
}

export default App;
