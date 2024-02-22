export type AprovacaoNC = {
  id?: number;
  possuiImplementacao: boolean;
  dataImplementacao?: Date;
  responsavelImplementacao?: number;
  descImplementacao: string;
  possuiEficacia: boolean;
  dataEficacia?: Date;
  responsavelEficacia?: number;
  novoRegistro: boolean;
  descEficacia: string;
  dataFechamento?: Date;
  responsavelFechamento?: number;
  alterarRisco: boolean;
  vinculoRisco?: number;
  descFechamento: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
};
