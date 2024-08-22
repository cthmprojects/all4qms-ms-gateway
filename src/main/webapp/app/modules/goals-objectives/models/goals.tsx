import { EnumTemporal } from './enums';

export interface ListMeta {
  idMetaObjetivo: Number;
  idMeta: Number;
  idMetaResultado: Number;
  descricaoMeta: String;
  avaliacao: String;
  analise: String;
  parcial: Boolean;
  metaAtingida: Boolean;
  lancadoEm: Date;
}

export type MetaObjetivo = {
  idMetaObjetivo: Number;
  politicaSGQ: String;
  desdobramentoSGQ: String;
  objetivoSGQ: String;
  meta: Meta;
};

export type MetaRecurso = {
  id: number;
  recursoNome: String;
};

export type MetaAnexo = {
  idAnexo: Number;
  nomeFisico: String;
  nomeOriginal: String;
  extensao: String;
  caminho: String;
  dataCriacao: Date;
};

export type MetaResultado = {
  idResultado: Number;
  avaliacao: String;
  analise: String;
  parcial: Boolean;
  metaAtingida: Boolean;
  lancadoEm: Date;
  periodo: Date;
  anexo: MetaAnexo;
};

export type Meta = {
  idMeta: Number;
  descricao: String;
  indicador: String;
  medicao: String;
  acao: String;
  avaliacaoResultado: String;
  idProcesso: Number; //entity Processo ( Lista )
  monitoramento: EnumTemporal;
  periodo: EnumTemporal;
  recursos: MetaRecurso[];
  resultado: MetaResultado;
};
