export type InstitutionalPlan = {
  id?: number;
  mission: string;
  policy: string;
  values: Array<string>;
  vision: string;
};

export type RawInstitutionalPlan = {
  id?: number;
  missao: string;
  politicaQualidade: string;
  valores: Array<string>;
  visao: string;
};
