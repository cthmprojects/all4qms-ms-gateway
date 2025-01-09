import { IndicatorGoal } from './indicator-goal';

export type Analysis = {
  action: string;
  analysisDetails: string;
  deadline: string;
  description: string;
  id?: number;
  responsible: string;
  month: number;
  indicatorGoal: IndicatorGoal;
  indicatorGoalId: number;
};

export type RawAnalysis = {
  id?: number;
  idIndicadorMeta: number;
  idPlano?: number;
  analiseCritica: string;
  observacao: string;
  mes: number;
  ano: number;
  criadoPor?: number;
  criadoEm?: Date;
  atualizadoPor?: number;
  atualizadoEm?: Date;
};
