export type RncPlan = {
  actions?: number;
  completedActions?: number;
  completion?: Date;
  description: string;
  deadline: Date;
  percentage?: number;
  status: string;
  responsibleId: number;
  rncId: number;
};

export type Plan = {
  id?: number;
  statusPlano: string;
  qtdAcoes: number;
  qtdAcoesConcluidas: number;
  percentualPlano: number;
  dtConclusaoPlano: Date;
  criadoEm?: Date;
  atualizadoEm?: Date;
  idNaoConformidade: number;
};
