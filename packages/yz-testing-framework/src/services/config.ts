import { YZTestingConfig } from "../types/config.ts";
import { singleton } from "tsyringe";

@singleton()
class ConfigurationService {
  apiEndpoint = "https://httpbin.org";
  requestTimeoutMs = 5000;

  assign(config: YZTestingConfig) {
    Object.assign(this, config);
  }
}

export default ConfigurationService;
