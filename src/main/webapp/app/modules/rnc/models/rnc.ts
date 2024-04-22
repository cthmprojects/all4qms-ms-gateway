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
