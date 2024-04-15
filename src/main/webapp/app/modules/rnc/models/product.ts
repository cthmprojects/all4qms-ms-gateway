import { RncTraceability } from './traceability';

export type RncProduct = {
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

export type RawMaterial = {
  batch: string;
  batchSize: number;
  code: string;
  defects: number;
  deliveredAt: Date;
  description: string;
  identifier: string;
  inspectionRule: string;
  inspector: string;
  invoice: string;
  invoiceDate: Date;
  line: string;
  nqa: string;
  operator: string;
  opNumber: number;
  rejectionRate: number;
  requestNumber: number;
  samples: number;
  shift: string;
};
