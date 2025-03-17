export const bannerExperiment = {
  id: "homepage-banner",
  variants: [
    {
      id: "control",
      weight: 34,
      value: {
        style: "classic",
        title: "Welcome to Our Demo",
        description: "Discover the power of A/B testing",
        buttonText: "Learn More",
      },
    },
    {
      id: "treatment",
      weight: 33,
      value: {
        style: "modern",
        title: "Experience the Future",
        description: "See how A/B testing can transform your product",
        buttonText: "Get Started",
      },
    },
    {
      id: "minimal",
      weight: 33,
      value: {
        style: "minimal",
        title: "Simple. Effective. Powerful.",
        description: "A/B testing made easy",
        buttonText: "Try Now",
      },
    },
  ],
};
