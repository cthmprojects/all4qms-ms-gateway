import { RncTraceability } from './traceability';

export type RncClient = {
  batch: string;
  batchAmount: number;
  code: string;
  defects: number;
  description: string;
  name: string;
  opNumber: string;
  order: string;
  rejected: number;
  samples: number;
  supplier: string;
  traceability: RncTraceability;
};
