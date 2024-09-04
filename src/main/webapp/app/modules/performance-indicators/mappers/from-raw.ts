import { Enumerador, Indicador, Indicator, IndicatorGoal, MetaIndicador, Option } from '../models';

export const toIndicator = (indicador: Indicador): Indicator => {
  return {
    code: indicador.codigoIndicador,
    description: indicador.descricaoIndicador,
    id: indicador.id,
    indicatorGoalId: indicador.idMetaIndicador,
    name: indicador.nomeIndicador,
    processId: indicador.idProcesso,
    trend: indicador.tendencia,
    unit: indicador.unidade,
  };
};

export const toIndicatorGoal = (metaIndicador: MetaIndicador): IndicatorGoal => {
  return {
    frequency: metaIndicador.frequencia,
    goals: [
      metaIndicador.meta01,
      metaIndicador.meta02,
      metaIndicador.meta03,
      metaIndicador.meta04,
      metaIndicador.meta05,
      metaIndicador.meta06,
      metaIndicador.meta07,
      metaIndicador.meta08,
      metaIndicador.meta09,
      metaIndicador.meta10,
      metaIndicador.meta11,
      metaIndicador.meta12,
    ],
    id: metaIndicador.id,
    indicator: toIndicator(metaIndicador.indicador),
    measurements: [
      metaIndicador.medicao01,
      metaIndicador.medicao02,
      metaIndicador.medicao03,
      metaIndicador.medicao04,
      metaIndicador.medicao05,
      metaIndicador.medicao06,
      metaIndicador.medicao07,
      metaIndicador.medicao08,
      metaIndicador.medicao09,
      metaIndicador.medicao10,
      metaIndicador.medicao11,
      metaIndicador.medicao12,
    ],
    year: metaIndicador.anoIndicador,
  };
};

export const toOption = (enumerador: Enumerador): Option => {
  return {
    code: enumerador.cod,
    name: enumerador.nome,
    value: enumerador.valor,
  };
};