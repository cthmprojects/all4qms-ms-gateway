export type AnalysisDetails = {
  description: string;
  meaning: string;
  probability: 'Baixo' | 'Médio' | 'Alto';
  severity: 'Baixo' | 'Médio' | 'Alto';
};

export type AnalysisSummary = {
  analysis: string;
  date: Date;
  decision: string;
  probability: string;
  severity: string;
};
