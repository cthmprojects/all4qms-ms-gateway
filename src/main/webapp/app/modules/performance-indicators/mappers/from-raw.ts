import { Indicador, Indicator } from '../models';

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
