import { Indicador, Indicator } from '../models';

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
