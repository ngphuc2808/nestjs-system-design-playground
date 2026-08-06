export interface SystemModuleFlowStep {
  stepNumber: number;
  title: string;
  description: string;
  component: string;
}

export interface SystemModuleDoc {
  id: string;
  phase: string;
  moduleCode: string;
  title: string;
  badge: string;
  overview: string;
  naiveStrategy: {
    description: string;
    endpoint: string;
    method: 'GET' | 'POST';
    samplePayload?: any;
    drawback: string;
  };
  optimizedStrategy: {
    description: string;
    endpoint: string;
    method: 'GET' | 'POST';
    samplePayload?: any;
    advantage: string;
    additionalEndpoints?: { label: string; endpoint: string; method: 'GET' | 'POST' }[];
  };
  flowSteps: SystemModuleFlowStep[];
  benchmarkResult: {
    naiveMetric: string;
    optimizedMetric: string;
    improvement: string;
  };
  curlSnippet: string;
}
