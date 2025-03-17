# Y/Z Testing Framework

The *last* A/B testing framework you need.

## Features

- Deterministic variant assignment
- Persistent user identification
- Offline support

## Local Development

```bash  
# Install dependencies  
pnpm install  

# Start development server  
pnpm dev  

# Run tests  
pnpm test  

# Build for production  
pnpm build  
```

### Basic Usage
```ts
import YZTesting from '@pzubar/yz-testing-framework';

// Configuration
const config = {
  /** Custom user ID for manual user identification, i.e. the id from the database  */
  userId?: string;

  /** Base URL for the API endpoints (defaults to https://httpbin.org) */
  apiEndpoint?: string;

  /** Base URL for the API endpoints (defaults to 5000) */
  requestTimeoutMs?: number;
};

// Experiments definition
const experiments = [{
  id: string;
  variants: [
      id: string;
      weight: number;
      value: JSON | string | number;
  ]
}];

// Initialize the framework
const yzTesting = await YZTesting.init({ config, experiments });
```


## API Reference
### Class: YZTesting
The main class that provides the core functionality of the framework.
#### Constructor
```ts
constructor(config: YZTestingConfig)
```
Creates a new instance of the YZTesting framework. Generally, you should use the static `init` method instead of the constructor directly.
#### Static Methods
##### `init`
```ts
static async init({
  config,
  experiments
}: {
  config: YZTestingConfig;
  experiments: Array<Experiment>;
}): Promise<YZTesting>
```
Initializes the framework with the provided configuration and experiments. This is the recommended way to create a new instance.
#### Instance Methods
##### `setExperiments`
```ts
setExperiments(experiments: Array<Experiment>): void
```
Sets the experiments for the framework instance. This is called automatically by `init()`.
##### `trackInteraction`
```ts
async trackInteraction(experimentId: string): Promise<void>
```
Tracks an interaction for a specific experiment.
- **Parameters:**
    - `experimentId`: The unique identifier of the experiment

##### `getExperimentValue`
```ts
getExperimentValue<T>(experimentId: string, fallback?: T): T | null
```
Retrieves the variant value for a specific experiment and automatically tracks the exposure.
- **Parameters:**
    - `experimentId`: The unique identifier of the experiment
    - `fallback`: Optional fallback value if the experiment value is not available

- **Returns:** The experiment variant value, fallback value, or null

## Dependencies
The framework uses the following key dependencies:
- `tsyringe` for dependency injection
- Types defined in `types/*`
- Various services for handling API calls, configuration, and storage

## Services
The framework automatically sets up the following services:
- `ExperimentManager`: Manages experiment variants and tracking
- `FetchApiService`: Handles API communications
- `ConfigurationService`: Manages framework configuration
- `LocalStorageService`: Handles local storage operations

Thanks to the DI approach, it is easy to change the dependencies in the runtime, 
i.e. if you would like to use IndexedDB instead od the LocalStorage 

## Error Handling
The framework will throw an error if methods are called before initialization. Always ensure the framework is properly initialized using the `init` method before calling any other methods.
``` ts
// This will throw an error if called before initialization
yzTesting.getExperimentValue('experiment-id');
```

## Notes
- The framework includes a simulated async load (500ms delay) during initialization
- Dependency injection is handled automatically during initialization

# Simple demo app
Visit the live demo: https://pzubar.github.io/yz-testing. See `/demo` React app for details. 
It uses React Suspend with "optimistic" UI banner to demonstrate the way to avoid the visible flicker
while the framework is being loaded.

