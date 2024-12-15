import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { toInstitutionalPlan, toRawInstitutionalPlan } from '../mappers';
import { InstitutionalPlan, RawInstitutionalPlan } from '../models';
import { EixosSwot } from '../models/swot';
import { ListPagination } from '../../goals-objectives/reducers/metas-list.reducer';

const apiUrl = 'services/all4qmsmsauditplan/api/planest/swots';

const initialState: EntityState<EixosSwot> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export interface ListPaginationRequestSwot {
  page?: number;
  size?: number;
  habilitado?: boolean;
  status?: 'PENDENTE' | 'CONTROLADO' | 'TRATATIVA';
  eixo?: 'FORCAS' | 'FRAQUEZAS' | 'OPORTUNIDADES' | 'AMEACAS';
  pesquisa?: string;
}

export const buildQueryParams = (params: ListPaginationRequestSwot): string => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);

  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  return queryParams.length ? `?${queryParams.join('&')}` : '';
};

export const getSwot = createAsyncThunk('get/swot', async (id: number) => {
  return axios.get<EixosSwot>(`${apiUrl}/${id}`);
});

export const getSwotAllFilter = createAsyncThunk('get/swot-all-filter', async (params: ListPaginationRequestSwot) => {
  const query = buildQueryParams(params);

  const url = `${apiUrl}${query}`;
  return axios.get<ListPagination>(url);
});

export const getSwotAll = createAsyncThunk('get/all/swot-all', async () => {
  return axios.get<ListPagination>(`${apiUrl}`);
});

export const saveLoteSwot = createAsyncThunk('save/swot-lote', async (listEixoSwot: EixosSwot[]) => {
  // Crie um array de promessas para as requisições POST
  const promessas = listEixoSwot.map(swot =>
    swot.id ? axios.put<EixosSwot>(`${apiUrl}/${swot.id}`, swot) : axios.post<EixosSwot>(apiUrl, swot)
  );

  // Execute todas as promessas
  return axios
    .all(promessas)
    .then(respostas => {
      // Aqui você pode acessar as respostas de cada requisição
      respostas.forEach((resposta, index) => {
        console.log(`Resposta do Item ${index + 1}:`, resposta.data);
      });
      return respostas.map(item => item.data);
    })
    .catch(error => {
      // Lidar com erros
      console.error('Erro ao fazer as requisições:', error);
      return [];
    });
});

export const saveSwot = createAsyncThunk('save/swot', async (eixoSwot: EixosSwot) => {
  return axios.post<EixosSwot>(apiUrl, eixoSwot);
});

export const updateSwot = createAsyncThunk('update/swot', async (swot: EixosSwot) => {
  return axios.put<EixosSwot>(`${apiUrl}/${swot.id}`, swot);
});

const swotSlice = createEntitySlice({
  name: 'swot',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getSwot), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(getSwotAllFilter), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.content;
        state.totalItems = action.payload.data.totalElements;
      })
      .addMatcher(isFulfilled(getSwotAll), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.content;
        state.totalItems = action.payload.data.totalElements;
      })
      .addMatcher(isFulfilled(saveSwot), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(updateSwot), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(saveLoteSwot), (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      });
  },
});

export const { reset } = swotSlice.actions;

export default swotSlice.reducer;
