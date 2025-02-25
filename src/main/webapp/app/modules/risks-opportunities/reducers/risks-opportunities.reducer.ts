import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { AprovacaoNC, Plan } from 'app/modules/rnc/models';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { mapInterestPartToRaw } from '../mappers';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  Ishikawa,
  PaginatedResource,
  RawAnalysis,
  RawApproval,
  RawCauseEffectInvestigation,
  RawCompleteAnalysis,
  RawInterestedPart,
  RawInvestigation,
  RawIshikawaInvestigation,
  RawPlanAction,
  RawPlanWithActions,
  RawRiskOpportunity,
  RawRiskOpportunityAnalysis,
  Reason,
  RiskOpportunity,
  RiskOpportunityFromList,
} from '../models';
import { toast } from 'react-toastify';

const apiRiscoOportunidadeUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades';
const apiRiscoOportunidadeTipoROUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades/tipo-ro';
const apiRiscoOportunidadeFiltroUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades/filtro';
const apiLinhaConfigRoUrl = 'services/all4qmsmsrisco/api/risco/linha-configros';
const apiAnaliseRoUrl = 'services/all4qmsmsrisco/api/risco/analise-ros';
const aprovacaoNcUrl = 'services/all4qmsmsrnc/api/aprovacao-ncs';
const planApiUrl = 'services/all4qmsmsrnc/api/planos';
const investigationApiUrl = 'services/all4qmsmsrnc/api/investigacao';
const actionPlanApiUrl = 'services/all4qmsmsrnc/api/acao-planos';
const ishikawaApiUrl = 'services/all4qmsmsrnc/api/causa-efeitos';
const reasonsApiUrl = 'services/all4qmsmsrnc/api/porques';
const apiPartesInteressadasUrl = 'services/all4qmsmsrisco/api/risco/partes-interessadas';

const acaoPlanoRncUrl = 'services/all4qmsmsrnc/api/acao-planos';

// Initial State
const initialState: EntityState<RawRiskOpportunity> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

interface ListParams {
  tipoRO: string;
  probabilidadeComplexidade?: string;
  severidadeMelhoria?: string;
  page?: number;
  size?: number;
  decisao?: string;
  idProcesso?: number;
  pesquisa?: string;
}

interface ListPagination {
  page?: number;
  size?: number;
}

interface RiskOpportunityPayload {
  senderId: number;
  efficacy: ActionPlanEfficacy;
  implementation: ActionPlanImplementation;
  ishikawa: Ishikawa | null;
  reasons: Reason | null;
  details: AnalysisDetails;
  interestedParts: { id?: number; nomeParteInteressada: string };
  riskOpportunity: RawRiskOpportunity;
  acoesPlano: RawPlanAction[];
  analise?: RawRiskOpportunityAnalysis;
}

const formatDate = (date: Date, shortened: boolean = false): string => {
  if (!date) return null;
  const year: string = date.getFullYear().toString();
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const day: string = date.getDate().toString().padStart(2, '0');
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: string = date.getMinutes().toString().padStart(2, '0');
  const seconds: string = date.getSeconds().toString().padStart(2, '0');
  const milliseconds: string = date.getMilliseconds().toString().padStart(3, '0');

  const long: string = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  const short: string = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return !shortened ? long : short;
};

export const listROs = createAsyncThunk('ro/list', async (params: ListPagination) => {
  const { page, size } = params;
  const queryParams: string[] = [];
  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);
  const queryString = queryParams.join('&');

  return axios.get<Array<RawRiskOpportunity>>(`${apiRiscoOportunidadeUrl}${queryString ? `?${queryString}` : ''}`);
});

export const listROFiltro = async (params: ListParams) => {
  const { page, size, ...rest } = params;

  const queryParams: string[] = [];

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push('sort=desc');
  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const queryString = queryParams.join('&');

  const realParams = {};

  for (const key of Object.keys(rest)) {
    const value = rest[key];
    if (value) {
      realParams[key] = value;
    }
  }

  return (
    await axios.post<PaginatedResource<RiskOpportunityFromList>>(
      `${apiRiscoOportunidadeFiltroUrl}${queryString ? `?${queryString}` : ''}`,
      realParams
    )
  ).data;
};

export const createRO = createAsyncThunk('ro/create', async (data: RiskOpportunity) => {
  return await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, data);
});

interface updateParams {
  id: number | string;
  data: RiskOpportunity;
}
export const updateRO = createAsyncThunk('ro/update', async ({ data, id }: updateParams) => {
  return await axios.patch(`${apiRiscoOportunidadeUrl}/${id}`, data);
});

export const deleteRO = createAsyncThunk('ro/delete', async (id: number | string) => {
  return await axios.delete(`${apiRiscoOportunidadeUrl}/${id}`);
});

export const getROById = createAsyncThunk('ro/get', async (id: number | string) => {
  const { data } = await axios.get<RawRiskOpportunity>(`${apiRiscoOportunidadeUrl}/${id}`);

  return {
    ...data,
    analiseROS: data.analiseROS.map(item => ({ ...item, dataAnalise: new Date(item.dataAnalise) })),
  };
});

function parseActionPlanToPayload(item: RawPlanAction) {
  return {
    ...item,
    dataVerificao: formatDate(item.dataVerificao as Date, true),
    prazoAcao: formatDate(item.prazoAcao as Date, true),
  };
}

async function saveAcaoPlano(item: RawPlanAction) {
  await axios.post(`${acaoPlanoRncUrl}`, item);
}

async function editAcaoPlano(item: RawPlanAction) {
  await axios.put(`${acaoPlanoRncUrl}/${item.id}`, item);
}

async function persistAcaoPlano(item: RawPlanAction) {
  await (item?.id ? editAcaoPlano(item) : saveAcaoPlano(item));
}

export function saveOnlyActions(acoesPlano: RawPlanAction[]) {
  const actions = Promise.all(acoesPlano.map(parseActionPlanToPayload).map(persistAcaoPlano));
  actions.then(values => console.log('##### Result', values));
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

export const editRiskOpportunity = createAsyncThunk('ro/edit', async (payload: RiskOpportunityPayload) => {
  try {
    const { details, efficacy, implementation, interestedParts, ishikawa, riskOpportunity, reasons, senderId, acoesPlano, analise } =
      payload;

    const interestedPartIdToBeRemoved: number = riskOpportunity.idPartesInteressadas;
    if (interestedPartIdToBeRemoved > 0) {
      await axios.delete(`${apiPartesInteressadasUrl}/${interestedPartIdToBeRemoved}`);
    }

    const analysisIdsToBeRemoved: Array<number> = riskOpportunity.idsAnaliseROS;
    if (analysisIdsToBeRemoved && analysisIdsToBeRemoved.length > 0) {
      for (let i = 0; i < analysisIdsToBeRemoved.length; i++) {
        const analysisIdToBeRemoved: number = analysisIdsToBeRemoved[i];
        await axios.delete(`${apiAnaliseRoUrl}/${analysisIdToBeRemoved}`);
      }
    }

    const idInterestedPart = await saveInterestedPartAsync(interestedParts as RawInterestedPart);

    riskOpportunity.idPartesInteressadas = idInterestedPart;

    riskOpportunity.idsAnaliseROS = null;

    const response = await axios.put<RawRiskOpportunity>(`${apiRiscoOportunidadeUrl}/${riskOpportunity.id}`, riskOpportunity);

    const resource: RawRiskOpportunity = response.data;

    const now: Date = new Date();

    if (analise?.id) saveOnlyActions(acoesPlano.map(item => ({ ...item, planoId: analise.idPlano })));

    const newAnalise: RawAnalysis = {
      id: analise?.id,
      atualizadoEm: now,
      atualizadoPor: senderId,
      corDecisao: '',
      criadoEm: now,
      criadoPor: senderId,
      dataAnalise: now,
      decisao: details.meaning,
      descricaoDecisao: details.description,
      idAprovacaoNC: analise.idAprovacaoNC,
      idInvestigacao: analise.idInvestigacao,
      idPlano: analise.idPlano,
      linhaConfigAnalise1: details.probability,
      linhaConfigAnalise2: details.severity,
      riscoOportunidade: resource,
    };
    // await (analise?.id ? axios.put(`${apiAnaliseRoUrl}/${analise.id}`, newAnalise) : axios.post(`${apiAnaliseRoUrl}`, body));

    const newAprovacao = {
      alterarRisco: true,
      atualizadoEm: now,
      criadoEm: now,
      dataEficacia: efficacy.efficacyVerificationDate,
      dataFechamento: null,
      dataImplementacao: implementation.implementationDate,
      descEficacia: efficacy.efficacyDescription,
      descFechamento: '',
      descImplementacao: implementation.implementationDescription,
      novoRegistro: true,
      possuiEficacia: efficacy.efficacyVerified,
      possuiImplementacao: implementation.implemented,
      responsavelEficacia: efficacy.efficacyResponsibleId,
      responsavelFechamento: null,
      responsavelImplementacao: implementation.implementationResponsibleId,
      vinculoRisco: resource.id,
      id: analise.idAprovacaoNC,
    };
    await editAprovacao(newAprovacao);

    const inestigacao = await getInvestigationById(analise.idInvestigacao);

    const porques = {
      id: inestigacao.idPorques,
      descCausa: reasons?.cause,
      descProblema: reasons?.effect,
      pq1: reasons?.reason1,
      pq2: reasons?.reason2,
      pq3: reasons?.reason3,
      pq4: reasons?.reason4,
      pq5: reasons?.reason5,
    };

    const ishikawaPayload = {
      id: inestigacao.idCausaEfeito,
      descCausaEfeito: ishikawa?.cause,
      maoDeObra: ishikawa?.workforce,
      maquina: ishikawa?.machine,
      materiaPrima: ishikawa?.rawMaterial,
      medicao: ishikawa?.measurement,
      meioAmbiente: ishikawa?.environment,
      metodo: ishikawa?.method,
    };

    await updatePorques(porques);
    await updateIshikawa(ishikawaPayload);

    toast.success('Salvo com sucesso!');
    return resource;
  } catch (error) {}
});

export const saveRiskOpportunity = createAsyncThunk('ro/save', async (payload: RiskOpportunityPayload) => {
  const { details, efficacy, implementation, interestedParts, ishikawa, riskOpportunity, reasons, senderId, acoesPlano } = payload;

  const idInterestedPart = await saveInterestedPartAsync(interestedParts as RawInterestedPart);

  riskOpportunity.idPartesInteressadas = idInterestedPart;

  const response = await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, riskOpportunity);

  if (response.status !== 201) {
    return null;
  }

  const resource: RawRiskOpportunity = response.data;

  const now: Date = new Date();

  const body: RawCompleteAnalysis = {
    acoesPlano: acoesPlano.map(parseActionPlanToPayload),
    riscoOportunidade: {
      id: resource.id,
    },
    analise: {
      atualizadoPor: senderId,
      corDecisao: '',
      criadoPor: senderId,
      dataAnalise: now,
      decisao: details.meaning,
      descricaoDecisao: details.description,
      idAprovacaoNC: null,
      idInvestigacao: null,
      idPlano: null,
      linhaConfigAnalise1: details.probability,
      linhaConfigAnalise2: details.severity,
      riscoOportunidade: resource,
    },
    aprovacao: {
      alterarRisco: true,
      dataEficacia: efficacy.efficacyVerificationDate,
      dataFechamento: null,
      dataImplementacao: implementation.implementationDate,
      descEficacia: efficacy.efficacyDescription,
      descFechamento: '',
      descImplementacao: implementation.implementationDescription,
      novoRegistro: true,
      possuiEficacia: efficacy.efficacyVerified,
      possuiImplementacao: implementation.implemented,
      responsavelEficacia: efficacy.efficacyResponsibleId,
      responsavelFechamento: null,
      responsavelImplementacao: implementation.implementationResponsibleId,
      vinculoRisco: resource.id,
    },
    ishikawa: {
      descCausaEfeito: ishikawa?.cause,
      maoDeObra: ishikawa?.workforce,
      maquina: ishikawa?.machine,
      materiaPrima: ishikawa?.rawMaterial,
      medicao: ishikawa?.measurement,
      meioAmbiente: ishikawa?.environment,
      metodo: ishikawa?.method,
    },
    plano: {
      statusPlano: 'ABERTO',
      qtdAcoes: 1,
      qtdAcoesConcluidas: 0,
      percentualPlano: 0,
      dtConclusaoPlano: null,
      idNaoConformidade: 1,
    },
    porques: {
      descCausa: reasons?.cause,
      descProblema: reasons?.effect,
      pq1: reasons?.reason1,
      pq2: reasons?.reason2,
      pq3: reasons?.reason3,
      pq4: reasons?.reason4,
      pq5: reasons?.reason5,
    },
  };

  await axios.post(apiAnaliseRoUrl, body);

  return resource;
});

export const saveMinimalRiskOpportunity = createAsyncThunk('ro/minimal/save', async (riskOpportunity: RawRiskOpportunity) => {
  const idInterestedPart = await saveInterestedPartAsync({
    atualizadoEm: null,
    atualizadoPor: null,
    criadoEm: null,
    criadoPor: null,
    id: null,
    nomeParteInteressada: '',
  });

  riskOpportunity.idPartesInteressadas = idInterestedPart;

  const response = await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, riskOpportunity);

  if (response.status !== 201) {
    return null;
  }

  const resource: RawRiskOpportunity = response.data;

  return resource;
});

function actionPlanParser(payload: any) {
  return {
    ...payload,
    prazoAcao: payload.prazoAcao ? new Date(payload.prazoAcao) : null,
    dataVerificao: payload.dataVerificao ? new Date(payload.dataVerificao) : null,
  } as RawPlanAction;
}

export const saveInterestedPartAsync = async (interestedPart: RawInterestedPart): Promise<number | null> => {
  const response = interestedPart.id
    ? await axios.put<RawInterestedPart>(`${apiPartesInteressadasUrl}/${interestedPart.id}`, interestedPart)
    : await axios.post<RawInterestedPart>(apiPartesInteressadasUrl, interestedPart);

  return response.data?.id || null;
};

export const getApprovalById = async (id: number): Promise<RawApproval> => {
  const response = await axios.get<RawApproval>(`${aprovacaoNcUrl}/${id}`);
  const resource = response.data;

  return {
    ...resource,
    dataImplementacao: resource.dataImplementacao && new Date(resource.dataImplementacao),
    dataEficacia: resource.dataEficacia && new Date(resource.dataEficacia),
    dataFechamento: resource.dataFechamento && new Date(resource.dataFechamento),
  };
};

export const getPlanById = async (id: number): Promise<RawPlanWithActions> => {
  const response = await axios.get<RawPlanWithActions>(`${planApiUrl}/byidplano/${id}`);
  const resource = response.data;

  return { acoes: resource.acoes.map(actionPlanParser), plano: resource.plano };
};

export const getInvestigationById = async (id: number): Promise<RawInvestigation> => {
  const response = await axios.get<RawInvestigation>(`${investigationApiUrl}/${id}`);
  const resource = response.data;

  return resource;
};

export const getIshikawaById = async (id: number): Promise<RawIshikawaInvestigation> => {
  const response = await axios.get<RawIshikawaInvestigation>(`${ishikawaApiUrl}/${id}`);
  const resource = response.data;

  return resource;
};

export const getReasonsById = async (id: number): Promise<RawCauseEffectInvestigation> => {
  const response = await axios.get<RawCauseEffectInvestigation>(`${reasonsApiUrl}/${id}`);
  const resource = response.data;

  return resource;
};

const ROSlice = createEntitySlice({
  name: 'risco',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isPending(listROs), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(listROs), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createRO), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(deleteRO), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(updateRO), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(getROById), (state, action) => {
        return {
          ...state,
          loading: false,
          entity: action.payload,
        };
      })
      .addMatcher(isFulfilled(saveRiskOpportunity), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(editRiskOpportunity), (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      })
      .addMatcher(isFulfilled(saveMinimalRiskOpportunity), (state, action) => {
        state.loading = false;
      });
  },
});

export const { reset: resetRiskOportunity } = ROSlice.actions;

// Reducers
export default ROSlice.reducer;
