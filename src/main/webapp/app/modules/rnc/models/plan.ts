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
