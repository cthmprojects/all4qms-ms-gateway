export type RawRiskOpportunity = {
  id: number;
  idEmissor: number;
  dataRegistro: Date;
  tipoRO: 'R' | 'O';
  idProcesso: number;
  nomeFluxo: string;
  nomeAtividade: string;
  descricao1: string;
  descricao2: string;
  descricao3: string;
  descricaoControle: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
  idPartesInteressadas: number;
  idLinhaConfigControle1: number;
  idLinhaConfigControle2: number;
  idsAnaliseROS: Array<number>;
};

export type RawRiskOpportunityConfiguration = {
  id: number;
  tipoRO: 'R';
  tipoAnaliseRO: 'P';
  grauRO: 'A';
  pesoRO: number;
  decisaoRO: string;
  descricaoRO: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type RawRiskOpportunityAnalysis = {
  id: number;
  dataAnalise: Date;
  decisao: string;
  descricaoDecisao: string;
  corDecisao: string;
  idInvestigacao: number;
  idPlano: number;
  idAprovacaoNC: number;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
  linhaConfigAnalise1: null; // TODO: Precisa ser ID
  linhaConfigAnalise2: null; // TODO: Precisa ser ID
  riscoOportunidade: null; // TODO: Precisa ser ID
};

export type RawInterestedPart = {
  id: number;
  nomeParteInteressada: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
};
