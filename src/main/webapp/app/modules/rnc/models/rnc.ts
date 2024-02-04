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

/*
  {
  "statusAtual": "PREENCHIMENTO",
  "idUsuarioAtual": 0, // usuário
  "dtNC": "2024-01-29T23:09:53.942Z",
  "tipoNC": "NC",
  "origemNC": "AUDITORIA_INTERNA",
  "possuiReincidencia": true,
  "idEmissorNC": 0, // usuário
  "processoNC": 0, // id do processo (pra onde vai)
  "idReceptorNC": 0, //
  "processoEmissor": 0, // id do processo (de onde veio)
  }
*/

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
