import { EnumPartes } from 'app/shared/model/enumerations/enum-partes';
import { CronogramaAuditoria, ModeloAuditoria } from './audit-models';
import { capitalize } from 'lodash';
import { Stack } from '@mui/material';

export function naoConformidadeToRncMs(payload: any) {
  return {
    detalhesNaoConformidade: payload.descricao,
    requisitoDescumprido: payload.requisito,
    evidenciaObjetiva: payload.evidencia,
  };
}

export function partesLabel(name: EnumPartes) {
  const itens = {
    PARTE1: '1ª Parte',
    PARTE2: '2ª Parte',
    PARTE3: '3ª Parte',
  };
  return itens[name];
}

export const renderValueModelo = (modelo: ModeloAuditoria) => {
  return `${modelo.nomeAuditoria}, ${capitalize(modelo.tipo)}, ${capitalize(modelo.frequencia)}`;
};

export const renderValueCronograma = (cron: CronogramaAuditoria) => {
  // return `CRONOGRAMA: "${partesLabel(cron.parte)}, ${capitalize(cron.status)}" | MODELO: "${renderValueModelo(cron.modelo)}"`;

  return (
    <Stack>
      <span>{`CRONOGRAMA: "${partesLabel(cron.parte)}, ${capitalize(cron.status)}"`}</span>
      <span>{`MODELO: "${renderValueModelo(cron.modelo)}"`}</span>
    </Stack>
  );
};

export const handleFilter = (payload: Record<string, any>) => {
  const itens = Object.values(payload).filter(value => !!value);
  if (!itens.length) return {};

  const params = {};
  for (const key of Object.keys(payload)) {
    const value = payload[key];
    if (value) params[key] = value;
  }
  return params;
};

export function isEqual(option: any, value: any) {
  return option.id == value.id;
}

/**
 * primeiro salva NC/Não conformidade, enviar apenas
 * dtNC (alguma data)
 * idEmissorNC
 * idReceptorNC
 * idUsuarioAtual
 * possuiReincidencia
 * processoEmissor
 * processoNC
 * tipoNC NC ou OM
 * origemNC INTERNA ou Externa
 * qtdPorques
 * statusAtual "PREENCHIMENTO"
 */

/**
 * depois salva auditorias /auditorias, enviar apenas
 * idNaoConformidade *idAcima
 * normaAuditoria (norma)
 * ocorrenciaAuditoria (número NC)
 * processoAuditoria (numero do relatorio)
 * requisitoAuditoria (Requisito da Norma)
 * sequecialAuditoria *aparentemente sempre 1
 */

/**
 * depois salva desc não conformidade /descricao-nao-conformidades, enviar apenas
 * naoConformidade *idAcima
 * detalhesNaoConformidade (Não conformidade)
 * requisitoDescumprido (Requisito descumprido)
 * evidenciaObjetiva (evidencia objetiva)
 * sequecialAuditoria *aparentemente sempre 1
 */
