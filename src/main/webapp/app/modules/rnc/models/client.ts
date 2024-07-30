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
  productName: string;
  rejected: number;
  requestNumber: number;
  samples: number;
  supplier: string;
  traceability: RncTraceability;
};
