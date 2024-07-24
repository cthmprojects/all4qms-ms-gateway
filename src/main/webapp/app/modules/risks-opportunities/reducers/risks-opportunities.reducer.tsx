import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { AnalysisSummary, RiskOpportunity } from '../models';

const apiRiscoOportunidadeUrl = 'services/all4qmsmsinfodoc/api/ro/riscos-oportunidades';

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
  probabilidade?: string;
  severidade?: string;
  dtIni?: Date;
  dtFim?: Date;
  page?: number;
  size?: number;
  decisao?: string;
  idProcesso?: number;
}

export const listROs = createAsyncThunk('ro/list', async (params: ListParams) => {
  const { dtIni, dtFim, idProcesso, probabilidade, severidade, decisao, page, size } = params;

  const queryParams: string[] = [];

  queryParams.push('sort=desc');

  if (dtIni) {
    queryParams.push(`dtIni=${dtIni}`);
  }

  if (dtFim) {
    queryParams.push(`dtFim=${dtFim}`);
  }

  if (idProcesso) {
    queryParams.push(`idProcesso=${idProcesso}`);
  }

  if (probabilidade) {
    queryParams.push(`probabilidade=${probabilidade}`);
  }

  if (severidade) {
    queryParams.push(`severidade=${severidade}`);
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

  return axios.get<Array<RiskOpportunity>>(`${apiRiscoOportunidadeUrl}${queryString ? `?${queryString}` : ''}`);
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
  name: 'ro',
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
      });
  },
});

export const { reset } = ROSlice.actions;

// Reducers
export default ROSlice.reducer;
