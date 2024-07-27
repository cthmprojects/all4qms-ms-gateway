import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { AnalysisSummary, RiskOpportunity } from '../models';

const apiRiscoOportunidadeUrl = 'services/all4qmsmsrisco/api/ro/riscos-oportunidades';
const apiRiscoOportunidadeTipoROUrl = 'services/all4qmsmsrisco/api/ro/riscos-oportunidades/tipo-ro';
const apiRiscoOportunidadeFiltroUrl = 'services/all4qmsmsrisco/api/ro/riscos-oportunidades/filtro';

// Initial State
const initialState: EntityState<RiskOpportunity> = {
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
}

interface ListPagination {
  page?: number;
  size?: number;
}

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

  return axios.get<Array<RiskOpportunity>>(`${apiRiscoOportunidadeUrl}${queryString ? `?${queryString}` : ''}`);
});

export const listROFiltro = createAsyncThunk('ro/listfilter', async (params: ListParams) => {
  const { tipoRO, idProcesso, probabilidadeComplexidade, severidadeMelhoria, decisao, page, size } = params;

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

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);
  const queryString = queryParams.join('&');

  return axios.get<Array<RiskOpportunity>>(`${apiRiscoOportunidadeFiltroUrl}${queryString ? `?${queryString}` : ''}`);
});

export const createRO = createAsyncThunk('ro/create', async (data: RiskOpportunity) => {
  return await axios.post<RiskOpportunity>(apiRiscoOportunidadeUrl, data);
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
  const { data } = await axios.get<RiskOpportunity>(`${apiRiscoOportunidadeUrl}/${id}`);

  return data;
});

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
      });
  },
});

export const { reset } = ROSlice.actions;

// Reducers
export default ROSlice.reducer;
