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
  politica: string;
  valores: Array<string>;
  visao: string;
};

export type RawInstitutional = {
  atualizadoEm?: Date;
  criadoEm?: Date;
  id?: number;
  missao: string;
  politica: string;
  visao: string;
};

export type RawValue = {
  atualizadoEm?: Date;
  criadoEm?: Date;
  id?: number;
  descricaoValores: string;
  institucional: RawInstitutional;
};
