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
  vinculoDocAnterior?: number;
  vinculoProduto?: number;
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
