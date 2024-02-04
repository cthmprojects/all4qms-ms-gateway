import { RncPlan } from './plan';

export type RncPlannedAction = {
  description: string;
  goal?: string;
  sector?: string;
  deadline: Date;
  responsibleId: number;
  cost?: number;
  result?: string;
  percentage?: number;
  date: Date;
  attachments?: string;
  conformant?: boolean;
  discordanceReason?: string;
  evaluationResult?: string;
  evaluationDate?: Date;
  evaluationAttachments?: string;
  completed?: boolean;
  completionDate?: Date;
  status: string;
  plan: RncPlan;
};
