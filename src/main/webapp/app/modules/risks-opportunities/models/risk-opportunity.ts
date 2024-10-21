import { RawInterestedPart } from './raw';

export type RiskOpportunity = {
  activity: string;
  date: Date;
  description: string;
  firstAuxiliaryDescription: string;
  flow: string;
  id?: number;
  interestedParts: RawInterestedPart;
  processId: number;
  secondAuxiliaryDescription: string;
  senderId: number;
  type: string;
};
