import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  AnalysisSummary,
  Ishikawa,
  RawInterestedPart,
  RawRiskOpportunity,
  RawRiskOpportunityAnalysis,
  RawRiskOpportunityConfiguration,
  Reason,
  RiskOpportunity,
} from '../models';
import { AprovacaoNC, Plan } from 'app/modules/rnc/models';

const apiRiscoOportunidadeUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades';
const apiRiscoOportunidadeTipoROUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades/tipo-ro';
const apiRiscoOportunidadeFiltroUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades/filtro';
const apiLinhaConfigRoUrl = 'services/all4qmsmsrisco/api/risco/linha-configros';
const apiAnaliseRoUrl = 'services/all4qmsmsrisco/api/risco/analise-ros';
const aprovacaoNcUrl = 'services/all4qmsmsrnc/api/aprovacao-ncs';
const planApiUrl = 'services/all4qmsmsrnc/api/planos';
const actionPlanApiUrl = 'services/all4qmsmsrnc/api/acao-planos';
const ishikawaApiUrl = 'services/all4qmsmsrnc/api/causa-efeitos';
const reasonsApiUrl = 'services/all4qmsmsrnc/api/porques';
const apiPartesInteressadasUrl = 'services/all4qmsmsrisco/api/risco/partes-interessadas';

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
  tipoRO?: string;
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

const formatDate = (date: Date, shortened: boolean = false): string => {
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

export const listROFiltro = createAsyncThunk('ro/listfilter', async (params: ListParams) => {
  const { tipoRO, idProcesso, probabilidadeComplexidade, severidadeMelhoria, decisao, pesquisa, page, size } = params;

  const queryParams: string[] = [];

  queryParams.push('sort=desc');

  if (tipoRO) {
    queryParams.push(`tipoRO=${tipoRO}`);
  }

  if (idProcesso) {
    queryParams.push(`idProcesso=${idProcesso}`);
  }

  if (probabilidadeComplexidade) {
    queryParams.push(`probabilidadeComplexidade=${probabilidadeComplexidade}`);
  }

  if (severidadeMelhoria) {
    queryParams.push(`severidade=${severidadeMelhoria}`);
  }

  if (decisao) {
    queryParams.push(`decisao=${decisao}`);
  }

  if (pesquisa) {
    queryParams.push(`pesquisa=${pesquisa}`);
  }

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);
  const queryString = queryParams.join('&');

  return axios.get<Array<RawRiskOpportunity>>(`${apiRiscoOportunidadeFiltroUrl}${queryString ? `?${queryString}` : ''}`);
});

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

  return data;
});

export const saveRiskOpportunity = createAsyncThunk('ro/save', async (riskOpportunity: RawRiskOpportunity) => {
  return await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, riskOpportunity);
});

export const saveRiskOpportunityConfigAsync = async (configuration: RawRiskOpportunityConfiguration): Promise<number | null> => {
  const response = await axios.post<RawRiskOpportunityConfiguration>(apiLinhaConfigRoUrl, configuration);

  if (response.status === 201) {
    return response.data?.id;
  } else {
    return null;
  }
};

export const saveRiskOpportunityApprovalAsync = async (
  implementation: ActionPlanImplementation,
  efficacy: ActionPlanEfficacy
): Promise<number | null> => {
  const now: Date = new Date();
  const response = await axios.post<AprovacaoNC>(aprovacaoNcUrl, {
    possuiImplementacao: implementation.implemented,
    dataImplementacao: implementation.implementationDate,
    responsavelImplementacao: implementation.implementationResponsibleId,
    descImplementacao: implementation.implementationDescription,
    possuiEficacia: efficacy.efficacyVerified,
    dataEficacia: efficacy.efficacyVerificationDate,
    responsavelEficacia: efficacy.efficacyResponsibleId,
    novoRegistro: true,
    descEficacia: efficacy.efficacyDescription,
    dataFechamento: null,
    responsavelFechamento: null,
    alterarRisco: false,
    vinculoRisco: null,
    descFechamento: null,
    criadoEm: now,
    atualizadoEm: now,
  });

  if (response.status === 201) {
    return response.data?.id;
  } else {
    return null;
  }
};

export const saveRiskOpportunityPlanAsync = async (summary: ActionPlanSummary): Promise<number | null> => {
  const planResponse = await axios.post<Plan>(planApiUrl, {
    statusPlano: 'ABERTO',
    qtdAcoes: 1,
    qtdAcoesConcluidas: 0,
    percentualPlano: 0,
    dtConclusaoPlano: formatDate(summary.actionDate),
    idNaoConformidade: 1,
  });

  if (planResponse.status !== 201) {
    return null;
  }

  const savedPlan: Plan = planResponse.data;

  const response = await axios.post(actionPlanApiUrl, {
    idPlano: savedPlan.id,
    descricaoAcao: summary.actionDescription,
    prazoAcao: formatDate(summary.actionDate, true),
    idResponsavelAcao: summary.responsibleId,
    statusAcao: 'VISTO',
    dataVerificao: formatDate(summary.actionVerificationDate, true),
    idResponsavelVerificaoAcao: summary.actionVerifierId,
    idAnexosExecucao: null,
    dataConclusaoAcao: formatDate(summary.actionVerificationDate),
    planoId: savedPlan.id,
  });

  if (response.status === 201) {
    return response.data.id;
  } else {
    return null;
  }
};

export const saveRiskOpportunityAnalysis = async (
  details: AnalysisDetails,
  id: number,
  approvalId: number,
  investigationId: number,
  planId: number
): Promise<number | null> => {
  const now: Date = new Date();
  const response = await axios.post<RawRiskOpportunityAnalysis>(apiAnaliseRoUrl, {
    id: null,
    dataAnalise: now,
    decisao: details.description,
    descricaoDecisao: details.description,
    corDecisao: '',
    idInvestigacao: investigationId,
    idPlano: planId,
    idAprovacaoNC: approvalId,
    criadoPor: id,
    atualizadoPor: id,
    criadoEm: now,
    atualizadoEm: now,
  });

  if (response.status === 201) {
    return response.data?.id;
  } else {
    return null;
  }
};

export const saveRiskOpportunityInvestigation = async (ishikawa: Ishikawa | null, reason: Reason | null): Promise<number | null> => {
  if (ishikawa) {
    const response = await axios.post(ishikawaApiUrl, {
      descCausaEfeito: ishikawa.cause,
      meioAmbiente: ishikawa.environment,
      maoDeObra: ishikawa.workforce,
      metodo: ishikawa.method,
      maquina: ishikawa.machine,
      medicao: ishikawa.measurement,
      materiaPrima: ishikawa.rawMaterial,
    });

    if (response.status === 201) {
      return response.data?.id;
    } else {
      return null;
    }
  } else {
    const response = await axios.post(reasonsApiUrl, {
      descProblema: reason.effect,
      pq1: reason.reason1,
      pq2: reason.reason2,
      pq3: reason.reason3,
      pq4: reason.reason4,
      pq5: reason.reason5,
      descCausa: reason.cause,
    });

    if (response.status === 201) {
      return response.data?.id;
    } else {
      return null;
    }
  }
};

export const saveInterestedPartAsync = async (interestedPart: RawInterestedPart): Promise<number | null> => {
  const response = await axios.post<RawInterestedPart>(apiPartesInteressadasUrl, interestedPart);

  if (response.status === 201) {
    return response.data?.id;
  } else {
    return null;
  }
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
      .addMatcher(isFulfilled(listROFiltro), (state, action) => {
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
      });
  },
});

export const { reset } = ROSlice.actions;

// Reducers
export default ROSlice.reducer;
