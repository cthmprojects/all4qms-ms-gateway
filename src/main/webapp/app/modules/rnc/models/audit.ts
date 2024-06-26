export type RncAudit = {
  norm: string;
  occurrence: string;
  process: number;
  requirement: string;
  sequence: number;
  rncId: number | null;
};

export type GeneralAudit = {
  ncNumber: number;
  norm: string;
  normRequirements: string;
  reportNumber: number;
};
