export type RncImmediateAction = {
  deadline: Date;
  description: string;
  problem: string;
  status: string;
  validated: boolean;
  responsibleId: number;
  verifierId: number;
  rncId: number;
};
