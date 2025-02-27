import { RncTraceability } from './traceability';

export type RncClient = {
  id?: number;
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
  requestNumber: string;
  samples: number;
  supplier: string;
  traceability: RncTraceability;
};
