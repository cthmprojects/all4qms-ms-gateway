import { AprovacaoNC } from './aprovacao-nc';

export type Rnc = {
  acoesImediatas?: string;
  aprovacaoNC?: number;
  atualizadoEm?: Date;
  criadoEm?: Date;
  decisaoNC?: number;
  dtNC: Date;
  id?: number;
  idEmissorNC: number;
  idReceptorNC: number;
  idUsuarioAtual: number;
  ncOutros?: string;
  numNC?: number;
  origemNC: string;
  possuiReincidencia: boolean;
  processoEmissor: number;
  processoNC: number;
  statusAtual: string;
  tipoNC: string;
  vinculoAuditoria?: number;
  vinculoCliente?: number;
  vinculoDocAnterior?: Array<number>;
  vinculoProduto?: number;
  aprovacao?: AprovacaoNC;
  qtdPorques: number;
};

export type RNC = {
  numero: string;
  emissao: Date;
  emissor: string;
  descricao: string;
  responsavel: string;
  prazo: Date;
  acoes: string;
  verificacao: Date;
  eficacia: Date;
  fechamento: Date;
  status: string;
};

export type RncData = {
  idNc: number;
  descricao: string;
  emissor: string;
  responsavel: string;
  verificacao: Date;
  eficacia: Date;
  fechamento: Date;
};

export type ExtendedNc = {
  nc: Rnc;
  dados: RncData;
};

export type NonConformity = {
  id: number;
  numNC: number;
  statusAtual: string;
  idUsuarioAtual: number;
  dtNC: Date;
  tipoNC: string;
  origemNC: string;
  ncOutros: string;
  possuiReincidencia: boolean;
  idEmissorNC: number;
  processoNC: number;
  idReceptorNC: number;
  processoEmissor: number;
  vinculoAuditoria: number;
  acoesImediatas: number;
  criadoEm: Date;
  atualizadoEm: Date;
  vinculoCliente: number;
  vinculoProduto: number;
  decisaoNC: number;
  aprovacaoNC: number;
  vinculoDocAnterior: number;
  qtdPorques: number;
};

export type NonConformityAttachment = {
  id: number;
  nomeArquivoFisico: string;
  nomeArquivoOriginal: string;
  criadoEm: Date;
  atualizadoEm: Date;
  idDescricaoNaoConformidade: number;
  idReclamacao: number;
};

export type NonConformityDescriptionSummary = {
  id: number;
  detalhesNaoConformidade: string;
  requisitoDescumprido: string;
  evidenciaObjetiva: string;
  criadoEm: Date;
  atualizadoEm: Date;
  idNaoConformidade: number;
  anexos: Array<NonConformityAttachment>;
};

export type NonConformityDescription = {
  descricaoNaoConformidade: NonConformityDescriptionSummary;
  caminhoAnexo: string;
};

export type NonConformityAudit = {
  id: number;
  sequecialAuditoria: number;
  normaAuditoria: string;
  ocorrenciaAuditoria: string;
  requisitoAuditoria: string;
  processoAuditoria: number;
  idNaoConformidade: number;
};

export type NonConformityImmediateAction = {
  id: number;
  descricaoAcaoImediata: string;
  prazoAcaoImediata: Date;
  validacaoAcaoImediata: boolean;
  inconformidadeAcaoImediata: string;
  statusAcaoImediata: string;
  idResponsavelAcaoImediata: number;
  idResponsavelValidacaoAcaoImediata: number;
  criadoEm: Date;
  atualizadoEm: Date;
  idNaoConformidade: number;
};

export type NonConformityDecision = {
  id: number;
  descricaoDecisao: string;
  dataDecisao: Date;
  qtdAtual: number;
  qtdAprovada: number;
  qtdReprovada: number;
  qtdRejeitada: number;
  responsaveis: string;
  criadoEm: Date;
  atualizadoEm: Date;
  idDecisaoAtual: number;
  tipoDecisao: string;
  idNaoConformidade: number;
};

export type NonConformityCauseEffect = {
  id: number;
  descCausaEfeito: string;
  meioAmbiente: string;
  maoDeObra: string;
  metodo: string;
  maquina: string;
  medicao: string;
  materiaPrima: string;
};

export type NonConformityReason = {
  id: number;
  descProblema: string;
  pq1: string;
  pq2: string;
  pq3: string;
  pq4: string;
  pq5: string;
  descCausa: string;
};

export type NonConformityCoverage = {
  id: number;
  descricaoAbrangencia: string;
  criadoEm: Date;
  atualizadoEm: Date;
  idNaoConformidade: number;
};

export type NonConformityAction = {
  id: number;
  idPlano: number;
  descricaoAcao: string;
  prazoAcao: Date;
  idResponsavelAcao: number;
  statusAcao: string;
  dataVerificao: Date;
  idResponsavelVerificaoAcao: number;
  idAnexosExecucao: number;
  dataConclusaoAcao: Date;
  criadoEm: Date;
  atualizadoEm: Date;
  planoId: number;
};

export type NonConformityPlan = {
  id: number;
  statusPlano: string;
  qtdAcoes: number;
  qtdAcoesConcluidas: number;
  percentualPlano: number;
  dtConclusaoPlano: Date;
  criadoEm: Date;
  atualizadoEm: Date;
  idNaoConformidade: number;
};

export type NonConformityActionPlan = {
  plano: NonConformityPlan;
  acoes: Array<NonConformityAction>;
};

export type NonConformityApproval = {
  id: number;
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
  criadoEm: Date;
  atualizadoEm: Date;
};

export type NonConformityClient = {
  id: number;
  nomeClienteReclamacao: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type NonConformityProduct = {
  id: number;
  codigoProduto: string;
  nomeProduto: string;
  nomeFornecedor: string;
  lote: string;
  qtdLote: number;
  nqa: string;
  qtdAmostra: number;
  qtdDefeito: number;
  qtdRejeicao: number;
  numPedido: string;
  numOP: string;
  criadoEm: Date;
  atualizadoEm: Date;
  identificador: string;
  idOperadorOcorrencia: number;
  regimeInspecao: string;
  idRastreabilidadesRegistro: number;
};

export type NonConformityTraceability = {
  id: number;
  dtEntregaNF: Date;
  numNF: string;
  dtNF: Date;
  criadoEm: Date;
  atualizadoEm: Date;
  idNaoConformidade: number;
};

export type NonConformityComplaint = {
  cliente: NonConformityClient;
  produto: NonConformityProduct;
  rastreabilidade: NonConformityTraceability;
};

export type NonConformityOperator = {
  id: number;
  nomeOperador: string;
  linhaOperador: string;
  turnoOperador: string;
  nomeInspetorOperador: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

export type NonConformityRawMaterial = {
  produto: NonConformityProduct;
  operador: NonConformityOperator;
  rastreabilidade: NonConformityTraceability;
};

export type NonConformityOrigin = {
  outros: string;
  auditoria: NonConformityAudit;
  cliente: NonConformityComplaint;
  mpprod: NonConformityRawMaterial;
};

export type NonConformityEvidence = {
  evidencia: string;
  nomeAnexo: string;
  idAnexo: number;
};

export type NonConformitySummarizedDescription = {
  detalhesNaoConformidade: string;
  requisitoDescumprido: string;
  evidencias: Array<NonConformityEvidence>;
};

export type CompleteNc = {
  naoConformidade: NonConformity;
  descricaoNC: Array<NonConformityDescription>;
  descricaoNCv2: NonConformitySummarizedDescription;
  origem: NonConformityOrigin;
  abrangencia: NonConformityCoverage;
  acaoImediata: Array<NonConformityImmediateAction>;
  decisao: Array<NonConformityDecision>;
  ishikawa: NonConformityCauseEffect;
  porques: Array<NonConformityReason>;
  acaoPlano: Array<NonConformityActionPlan>;
  aprovacao: NonConformityApproval;
};
