export type MetaPeriodo = {
  idIndicador: number;
  idProcesso: number;
  anoIndicador: number;
  frequencia: string;
  tipo: string;
  dados: Array<DataChart>;
};

export type DataChart = {
  unidadeTemporal: string;
  unidadeMedida: string;
  meta: number;
  realizado: number;
};

export type SummaryChart = {
  meta: number;
  realizado: number;
  referencia: string;
};

export type Charts = {
  idIndicador: number;
  idProcesso: number;
  anoIndicador: string;
  metaPeriodo: Array<DataChart>;
  preenchimentoIndicadores: Array<DataChart>;
  metaProcesso: Array<DataChart>;
  comparacaoPeriodo: Array<DataChart>;
  qualidadeProducao: number;
  variacao: number;
};
