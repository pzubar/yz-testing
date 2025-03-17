import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { YZTesting } from "@yz/YZTesting";
import { YZTestingConfig } from "@yz/types/config";
import { Experiment } from "@yz/types/experiment";
import { mockExperiment } from "../mock-data/experiments.mock";
import { container } from "tsyringe";

vi.mock("tsyringe", () => ({
  container: {
    resolve: vi.fn(),
    register: vi.fn(),
  },
}));
vi.mock("@yz/services/experiment-manager", () => ({
  default: {
    setExperiments: vi.fn(),
  },
}));
vi.mock("@yz/services/config", () => ({
  default: { assign: vi.fn() },
}));
vi.mock("@yz/services/fetch-api", () => ({ default: {} }));
vi.mock("@yz/services/local-storage", () => ({ default: {} }));

describe("YZTesting", () => {
  const mockConfig: YZTestingConfig = {
    apiEndpoint: "https://api.test.com",
    requestTimeoutMs: 5000,
    userId: "test-user-123",
  };

  const mockExperiments: Array<Experiment> = [mockExperiment];

  const mockExperimentManager = {
    setExperiments: vi.fn(),
    trackInteraction: vi.fn(),
    getVariantAndTrack: vi.fn(),
  };

  const mockConfigService = {
    assign: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (container.resolve as jest.Mock)
      .mockReturnValueOnce(mockConfigService)
      .mockReturnValueOnce(mockExperimentManager);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("constructor", () => {
    it("should setup config", () => {
      new YZTesting(mockConfig);
      expect(mockConfigService.assign).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe("init", () => {
    it("should initialize YZTesting with config and experiments", async () => {
      vi.useFakeTimers();

      const initPromise = YZTesting.init({
        config: mockConfig,
        experiments: mockExperiments,
      });

      vi.advanceTimersToNextTimer();
      const instance = await initPromise;

      expect(mockExperimentManager.setExperiments).toHaveBeenCalledWith(
        mockExperiments,
      );
      expect(instance).toBeInstanceOf(YZTesting);
    });
  });

  describe("setExperiments", () => {
    it("should set experiments and mark as initialized", () => {
      const yzTesting = new YZTesting(mockConfig);
      yzTesting.setExperiments(mockExperiments);

      expect(mockExperimentManager.setExperiments).toHaveBeenCalledWith(
        mockExperiments,
      );
    });
  });

  describe("trackInteraction", () => {
    it("should track interaction when initialized", async () => {
      const yzTesting = new YZTesting(mockConfig);
      yzTesting.setExperiments(mockExperiments);

      await yzTesting.trackInteraction("test-experiment");

      expect(mockExperimentManager.trackInteraction).toHaveBeenCalledWith(
        "test-experiment",
      );
    });

    it("should throw error when not initialized", async () => {
      const yzTesting = new YZTesting(mockConfig);

      await expect(
        yzTesting.trackInteraction("test-experiment"),
      ).rejects.toThrow("YZ Testing framework is not initialized");
    });
  });

  describe("getExperimentValue", () => {
    it("should return experiment value when variant exists", () => {
      const mockValue = "test-value";
      mockExperimentManager.getVariantAndTrack.mockReturnValue({
        id: "variant-a",
        weight: 50,
        value: mockValue,
      });

      const yzTesting = new YZTesting(mockConfig);
      yzTesting.setExperiments(mockExperiments);

      const result = yzTesting.getExperimentValue("test-experiment");
      expect(result).toEqual(mockValue);
    });

    it("should return fallback value when variant doesn't exist", () => {
      mockExperimentManager.getVariantAndTrack.mockReturnValue(null);

      const yzTesting = new YZTesting(mockConfig);
      yzTesting.setExperiments(mockExperiments);

      const fallback = "fallback-value";
      const result = yzTesting.getExperimentValue("test-experiment", fallback);
      expect(result).toBe(fallback);
    });

    it("should return null when no variant or fallback exists", () => {
      mockExperimentManager.getVariantAndTrack.mockReturnValue(null);

      const yzTesting = new YZTesting(mockConfig);
      yzTesting.setExperiments(mockExperiments);

      const result = yzTesting.getExperimentValue("test-experiment");
      expect(result).toBeNull();
    });

    it("should throw error when not initialized", () => {
      const yzTesting = new YZTesting(mockConfig);

      expect(() => yzTesting.getExperimentValue("test-experiment")).toThrow(
        "YZ Testing framework is not initialized",
      );
    });
  });
});
