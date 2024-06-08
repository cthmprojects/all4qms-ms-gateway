export enum StatusEnum {
  EMISSAO = 'Em emissao',
  VALIDACAO = 'Em validacao',
  APROVACAO = 'Em aprovacao',
  REVISAO = 'Em revisao',
  VALIDAREV = 'Em validacao da revisao',
  APROVAREV = 'Em aprovacao da revisao',
  DISTRIBUIDAO = 'Em distribuicao',
  ASSINATURA = 'Em assinatura',
  CANCELAMENTO = 'Em cancelamento',
  APROVACANC = 'Em aprovacao do cancelamento',
  CONCLUIDO = 'Concluido',
}

export type InfoDoc = {
  id?: number;
  codigo: string;
  titulo: string;
  revisao?: number;
  descricaoDoc?: string;
  idArquivo: number;
  enumSituacao?: string;
  origem?: string;
  tipoDoc?: string;
  idProcesso?: number;
  idDocumentacaoAnterior?: number;
  ignorarValidade?: boolean;
  dataValidade?: Date;
  idPrazo?: number;
  idUsuarioCriacao?: number;
  dataCricao?: Date;
  dataPublicacao?: Date;
  emissor?: string;
  areaProcesso?: string;
  distribuicao?: string;
  status?: StatusEnum;
};
