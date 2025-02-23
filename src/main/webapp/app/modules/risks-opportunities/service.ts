import axios from 'axios';
import {
  RawAnalysis,
  RawApproval,
  RawCauseEffectInvestigation,
  RawCompleteAnalysis,
  RawInterestedPart,
  RawIshikawaInvestigation,
  RawPlanAction,
  RawRiskOpportunity,
} from './models';
import { saveInterestedPartAsync, saveOnlyActions } from './reducers/risks-opportunities.reducer';
import { addToast } from 'app/shared/util/add-toast';

const apiAnaliseRoUrl = 'services/all4qmsmsrisco/api/risco/analise-ros';
const apiRiscoOportunidadeUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades';

const aprovacaoNcUrl = 'services/all4qmsmsrnc/api/aprovacao-ncs';
const ishikawaApiUrl = 'services/all4qmsmsrnc/api/causa-efeitos';
const reasonsApiUrl = 'services/all4qmsmsrnc/api/porques';

type SavePayload = {
  riscoOportunidade: RawRiskOpportunity;
  analises: RawCompleteAnalysis[];
  partesInteressadas: Partial<RawInterestedPart>;
};

function parsePlanoDeAcao(payload: RawPlanAction) {
  return {
    ...payload,
    prazoAcao: (payload.prazoAcao && (payload.prazoAcao as Date).toISOString().replace('T', ' ').split('.')[0]) || null,
    dataVerificao: (payload.dataVerificao && (payload.dataVerificao as Date).toISOString().replace('T', ' ').split('.')[0]) || null,
    dataConclusaoAcao: (payload.dataConclusaoAcao && (payload.dataConclusaoAcao as Date).toISOString()) || null,
  } as RawPlanAction;
}

async function editAprovacao(item: RawApproval) {
  await axios.put(`${aprovacaoNcUrl}/${item.id}`, item);
}

async function updatePorques(porques: RawCauseEffectInvestigation) {
  axios.put(`${reasonsApiUrl}/${porques.id}`, porques);
}

async function updateIshikawa(ishikawa: RawIshikawaInvestigation) {
  axios.put(`${ishikawaApiUrl}/${ishikawa.id}`, ishikawa);
}

async function saveCompleteAnalise(item: RawCompleteAnalysis, riscoOportunidade: Partial<RawRiskOpportunity>) {
  const body = {
    ...item,
    riscoOportunidade: riscoOportunidade,
    acoesPlano: item.acoesPlano.map(parsePlanoDeAcao),
    plano: {
      statusPlano: 'ABERTO',
      qtdAcoes: 1,
      qtdAcoesConcluidas: 0,
      percentualPlano: 0,
      dtConclusaoPlano: null,
      idNaoConformidade: 1,
    },
    analise: { ...item.analise, riscoOportunidade: riscoOportunidade },
  } as RawCompleteAnalysis;
  return await axios.post(apiAnaliseRoUrl, body);
}

async function editCompleteAnalise(item: RawCompleteAnalysis, riscoOportunidade: Partial<RawRiskOpportunity>) {
  const { acoesPlano, analise, aprovacao, porques, ishikawa } = item;
  await saveOnlyActions(acoesPlano.map(item => ({ ...item, planoId: analise.idPlano })));
  Promise.all([
    editAprovacao(aprovacao),
    updatePorques(porques),
    updateIshikawa(ishikawa),
    axios.put(`${apiAnaliseRoUrl}/${analise.id}`, analise),
  ]);
}

async function persistCompleteAnalise(item: RawCompleteAnalysis, riscoOportunidade: Partial<RawRiskOpportunity>) {
  item.analise.id ? editCompleteAnalise(item, riscoOportunidade) : saveCompleteAnalise(item, riscoOportunidade);
}

export const deleteAnalise = addToast(
  async (analise: RawAnalysis) => {
    axios.delete(`${apiAnaliseRoUrl}/${analise.id}`);
  },
  'Exclusão realizada com sucesso!',
  'Problema ao excluir análise'
);

export const saveRiskOpportunity = addToast(
  async (payload: SavePayload) => {
    const { riscoOportunidade, analises, partesInteressadas } = payload;
    const idPartesInteressadas = await saveInterestedPartAsync(partesInteressadas as RawInterestedPart);
    riscoOportunidade.idPartesInteressadas = idPartesInteressadas;

    const { data: savedRiscoOportunidade } = await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, riscoOportunidade);
    delete riscoOportunidade.analiseROS;

    const roDto = { id: savedRiscoOportunidade.id };

    const result = await Promise.all(analises.map(async item => saveCompleteAnalise(item, roDto)));
    return savedRiscoOportunidade;
  },
  'Registro salvo com sucesso!',
  'Erro ao salvar o registro'
);

export const editRiskOpportunity = addToast(
  async (payload: SavePayload) => {
    const { riscoOportunidade, analises, partesInteressadas } = payload;

    const idPartesInteressadas = await saveInterestedPartAsync(partesInteressadas as RawInterestedPart);
    riscoOportunidade.idPartesInteressadas = idPartesInteressadas;

    const response = await axios.put<RawRiskOpportunity>(`${apiRiscoOportunidadeUrl}/${riscoOportunidade.id}`, riscoOportunidade);
    const savedRiscoOportunidade: RawRiskOpportunity = response.data;
    const roDto = { id: savedRiscoOportunidade.id };

    const result = await Promise.all(analises.map(async item => persistCompleteAnalise(item, roDto)));
  },
  'Registro editado com sucesso!',
  'Erro ao salvar edição do registro'
);

export const getWeightRoConfig = (level: string): number => {
  const localLevel = level.toUpperCase();
  if (localLevel.includes('PRIORIDADE 1')) {
    return 3;
  } else if (localLevel.includes('PRIORIDADE 2')) {
    return 2;
  } else {
    return 1;
  }
};
export const getColorRoConfig = (level: string): string => {
  const localLevel = level.toUpperCase();
  if (localLevel.includes('PRIORIDADE 1')) {
    return 'lightsalmon';
  } else if (localLevel.includes('PRIORIDADE 2')) {
    return 'lightgoldenrodyellow';
  } else {
    return 'lightgreen';
  }
};
