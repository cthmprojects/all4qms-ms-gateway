export type RiskOpportunity = {
  activity: string;
  date: Date;
  description: string;
  firstAuxiliaryDescription: string;
  flow: string;
  id?: number;
  interestedParts: Array<string>;
  processId: number;
  secondAuxiliaryDescription: string;
  senderId: number;
  type: string;
};
