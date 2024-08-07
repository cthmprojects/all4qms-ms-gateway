export type ConfigRow = {
  id: number;
  tipoRO: string; //R (Risco),O (Oportunidade)
  tipoAnaliseRO: string; //P (Probabilidade),S (Severidade),C (Complexidade),M (Melhoria)
  grauRO: string; //A (Alto),M (Medio),B (Baixo)
  pesoRO: number;
  decisaoRO: string;
  descricaoRO: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
};
export interface ConfigTipoRos {
  id: number;
  tipoRO: string; //R (Risco),O (Oportunidade)
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
  linhaConfig1: ConfigRow[];
  linhaConfig2: ConfigRow[];
  linhaConfigDecisao: ConfigRow[];
}

export type ConfigurationsDegreesType = {
  codigo?: number;
  label: string;
  color: string;
  weight: number;
  description: string;
};
export type ConfigurationsClassificationType = {
  codigo?: number;
  decision: string;
  description: string;
};

export type MapRisk = {
  id: number;
  tipoRO: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
  decisaoEixo11: DecisaoEixo;
  decisaoEixo12: DecisaoEixo;
  decisaoEixo13: DecisaoEixo;
  decisaoEixo21: DecisaoEixo;
  decisaoEixo22: DecisaoEixo;
  decisaoEixo23: DecisaoEixo;
  decisaoEixo31: DecisaoEixo;
  decisaoEixo32: DecisaoEixo;
  decisaoEixo33: DecisaoEixo;
};

export type DecisaoEixo = {
  id: number;
  tipoRO: string;
  tipoAnaliseRO: string;
  grauRO: string;
  pesoRO: number;
  decisaoRO: string;
  descricaoRO: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
};
