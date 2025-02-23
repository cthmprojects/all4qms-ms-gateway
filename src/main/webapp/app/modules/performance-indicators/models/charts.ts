export type MetaPeriodo = {
  idIndicador: number;
  idProcesso: number;
  anoIndicador: string;
  dados: Array<DataChart>;
};

export type DataChart = {
  unidadeTemporal: string;
  unidadeMedida: string;
  meta: number;
  realizado: number;
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
