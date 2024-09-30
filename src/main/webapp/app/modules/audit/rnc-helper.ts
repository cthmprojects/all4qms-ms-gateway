export function naoConformidadeToRncMs(payload: any) {
  return {
    detalhesNaoConformidade: payload.descricao,
    requisitoDescumprido: payload.requisito,
    evidenciaObjetiva: payload.evidencia,
  };
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
