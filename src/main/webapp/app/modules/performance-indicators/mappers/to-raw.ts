import { Enumerador, Indicador, Indicator, IndicatorGoal, MetaIndicador, Option } from '../models';

export const toRawIndicator = (indicator: Indicator): Indicador => {
  return {
    codigoIndicador: indicator.code,
    descricaoIndicador: indicator.description,
    id: indicator.id,
    idMetaIndicador: indicator.indicatorGoalId,
    idProcesso: indicator.processId,
    nomeIndicador: indicator.name,
    tendencia: indicator.trend,
    unidade: indicator.unit,
  };
};

export const toRawIndicatorGoal = (indicatorGoal: IndicatorGoal): MetaIndicador => {
  return {
    anoIndicador: indicatorGoal.year,
    frequencia: indicatorGoal.frequency,
    id: indicatorGoal.id,
    indicador: toRawIndicator(indicatorGoal.indicator),
    medicao01: indicatorGoal.measurements[0],
    medicao02: indicatorGoal.measurements[1],
    medicao03: indicatorGoal.measurements[2],
    medicao04: indicatorGoal.measurements[3],
    medicao05: indicatorGoal.measurements[4],
    medicao06: indicatorGoal.measurements[5],
    medicao07: indicatorGoal.measurements[6],
    medicao08: indicatorGoal.measurements[7],
    medicao09: indicatorGoal.measurements[8],
    medicao10: indicatorGoal.measurements[9],
    medicao11: indicatorGoal.measurements[10],
    medicao12: indicatorGoal.measurements[11],
    meta01: indicatorGoal.goals[0],
    meta02: indicatorGoal.goals[1],
    meta03: indicatorGoal.goals[2],
    meta04: indicatorGoal.goals[3],
    meta05: indicatorGoal.goals[4],
    meta06: indicatorGoal.goals[5],
    meta07: indicatorGoal.goals[6],
    meta08: indicatorGoal.goals[7],
    meta09: indicatorGoal.goals[8],
    meta10: indicatorGoal.goals[9],
    meta11: indicatorGoal.goals[10],
    meta12: indicatorGoal.goals[11],
  };
};

export const toRawOption = (option: Option): Enumerador => {
  return {
    cod: option.code,
    nome: option.name,
    valor: option.value,
  };
};
