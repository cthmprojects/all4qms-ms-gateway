import { EnumPartes } from 'app/shared/model/enumerations/enum-partes';
import { ModeloAuditoria } from './audit-models';
import { capitalize } from 'lodash';

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
  return `${modelo.nomeAuditoria} - ${capitalize(modelo.tipo)} - ${capitalize(modelo.frequencia)}`;
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
