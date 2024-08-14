import { Configuration } from './configuration';

export type AnalysisDetails = {
  description: string;
  meaning: string;
  probability: Configuration;
  severity: Configuration;
};

export type AnalysisSummary = {
  analysis: string;
  date: Date;
  decision: string;
  probability: string;
  severity: string;
};
