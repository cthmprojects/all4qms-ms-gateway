export type RncAudit = {
  norm: string;
  occurrence: string;
  process: number;
  requirement: string;
  sequence: number;
  rncId: number | null;
};

export type GeneralAudit = {
  ncNumber: string;
  norm: string;
  normRequirements: string;
  reportNumber: number;
};
