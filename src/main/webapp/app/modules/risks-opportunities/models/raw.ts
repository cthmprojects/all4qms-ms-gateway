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
  linhaConfigControle1?: RawRiskOpportunityConfiguration;
  linhaConfigControle2?: RawRiskOpportunityConfiguration;
  idsAnaliseROS: Array<number>;
  partesInteressadas?: RawInterestedPart;
  analiseROS?: Array<RawRiskOpportunityAnalysis>;
};

export type RiskOpportunityFromList = {
  causaFraqueza: string;
  descricao: string;
  efeitoBeneficio: string;
  id: number;
  nomeAtividade: string;
  nomeFluxo: string;
  probabilidadeComplexidade: string;
  processo: string;
  severidadeMelhoria: string;
};

export type RawRiskOpportunityConfiguration = {
  id?: number;
  tipoRO: 'R' | 'O';
  tipoAnaliseRO: 'P' | 'S' | 'C' | 'M' | 'D';
  grauRO: 'A' | 'M' | 'B';
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
  linhaConfigAnalise1: RawRiskOpportunityConfiguration;
  linhaConfigAnalise2: RawRiskOpportunityConfiguration;
  riscoOportunidade: RawRiskOpportunity;
};

export type RawInterestedPart = {
  id: number;
  nomeParteInteressada: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type RawMapAxis = {
  id: number;
  tipoRO?: 'R' | 'O';
  tipoAnaliseRO?: 'P' | 'S' | 'C' | 'O' | 'D';
  grauRO?: 'A' | 'M' | 'B';
  pesoRO?: number;
  decisaoRO?: string;
  descricaoRO?: string;
  criadoPor?: number;
  atualizadoPor?: number;
  criadoEm?: Date;
  atualizadoEm?: Date;
};

export type RawMap = {
  id?: number;
  tipoRO: 'R' | 'O';
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
  decisaoEixo11: RawMapAxis;
  decisaoEixo12: RawMapAxis;
  decisaoEixo13: RawMapAxis;
  decisaoEixo21: RawMapAxis;
  decisaoEixo22: RawMapAxis;
  decisaoEixo23: RawMapAxis;
  decisaoEixo31: RawMapAxis;
  decisaoEixo32: RawMapAxis;
  decisaoEixo33: RawMapAxis;
};

export type PaginatedResource<T> = {
  content: Array<T>;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
};

export type RawIshikawaInvestigation = {
  id?: number;
  descCausaEfeito: string;
  meioAmbiente: string;
  maoDeObra: string;
  metodo: string;
  maquina: string;
  medicao: string;
  materiaPrima: string;
};

export type RawCauseEffectInvestigation = {
  id?: number;
  descProblema: string;
  pq1: string;
  pq2: string;
  pq3: string;
  pq4: string;
  pq5: string;
  descCausa: string;
};

export type RawApproval = {
  id?: number;
  possuiImplementacao: boolean;
  dataImplementacao: Date;
  responsavelImplementacao: number;
  descImplementacao: string;
  possuiEficacia: boolean;
  dataEficacia: Date;
  responsavelEficacia: number;
  novoRegistro: boolean;
  descEficacia: string;
  dataFechamento: Date;
  responsavelFechamento: number;
  alterarRisco: boolean;
  vinculoRisco: number;
  descFechamento: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
};

export type RawPlan = {
  id?: number;
  statusPlano: 'ABERTO';
  qtdAcoes: number;
  qtdAcoesConcluidas: number;
  percentualPlano: number;
  dtConclusaoPlano: Date | string;
  criadoEm?: Date;
  atualizadoEm?: Date;
  idNaoConformidade?: number;
};

export type RawPlanAction = {
  id?: number;
  idPlano: number;
  descricaoAcao: string;
  prazoAcao: Date | string;
  idResponsavelAcao: number;
  statusAcao: 'PENDENTE' | 'VISTO';
  dataVerificao: Date | string;
  idResponsavelVerificaoAcao: number;
  idAnexosExecucao: number;
  dataConclusaoAcao: Date | string;
  criadoEm?: Date;
  atualizadoEm?: Date;
  planoId: number;
};

export type RawAnalysis = {
  id?: number;
  dataAnalise: Date;
  decisao: string;
  descricaoDecisao: string;
  corDecisao: string;
  idInvestigacao: number;
  idPlano: number;
  idAprovacaoNC: number;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm?: Date;
  atualizadoEm?: Date;
  linhaConfigAnalise1: RawRiskOpportunityConfiguration;
  linhaConfigAnalise2: RawRiskOpportunityConfiguration;
  riscoOportunidade: RawRiskOpportunity;
};

export type RawCompleteAnalysis = {
  id?: number;
  analise: RawAnalysis;
  ishikawa: RawIshikawaInvestigation;
  porques: RawCauseEffectInvestigation;
  aprovacao: RawApproval;
  plano: RawPlan;
  acoesPlano?: Array<RawPlanAction>;
  riscoOportunidade: {
    id: number;
  };
};

export type RawInvestigation = {
  id: number | null;
  idNaoConformidade: number | null;
  idCausaEfeito: number | null;
  idPorques: number | null;
};

export type RawPlanWithActions = {
  plano: RawPlan;
  acoes: Array<RawPlanAction>;
};
