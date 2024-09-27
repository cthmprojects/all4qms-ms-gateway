import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { toInstitutionalPlan, toRawInstitutionalPlan } from '../mappers';
import { InstitutionalPlan, RawInstitutionalPlan } from '../models';
import { EixosSwot } from '../models/swot';

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

interface ListPagination {
  page?: number;
  size?: number;
}

export const getSwot = createAsyncThunk('get/swot', async (id: number) => {
  return axios.get<EixosSwot>(`${apiUrl}/${id}`);
});

export const getSwotAllFilter = createAsyncThunk('get/swot-all-filter', async (params: ListPagination) => {
  const { page, size } = params;

  const queryParams: Array<string> = [];

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const query: string = queryParams.join('&');
  const urlParams: string = query ? `?${query}` : '';
  const url: string = `${apiUrl}${urlParams}`;

  return axios.get<Array<EixosSwot>>(url);
});

export const getSwotAll = createAsyncThunk('get/all/swot-all', async () => {
  return axios.get<Array<EixosSwot>>(`${apiUrl}`);
});

export const saveLoteSwot = createAsyncThunk('save/swot-lote', async (listEixoSwot: EixosSwot[]) => {
  // Crie um array de promessas para as requisições POST
  const promessas = listEixoSwot.map(swot => axios.post(apiUrl, swot));

  // Execute todas as promessas
  return axios
    .all(promessas)
    .then(
      axios.spread((...respostas) => {
        // Aqui você pode acessar as respostas de cada requisição
        respostas.forEach((resposta, index) => {
          console.log(`Resposta do Item ${index + 1}:`, resposta.data);
        });
        return respostas;
      })
    )
    .catch(error => {
      // Lidar com erros
      console.error('Erro ao fazer as requisições:', error);
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
        state.entities = action.payload.data;
      })
      .addMatcher(isFulfilled(getSwotAll), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
      })
      .addMatcher(isFulfilled(saveSwot), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(updateSwot), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      });
  },
});

export const { reset } = swotSlice.actions;

export default swotSlice.reducer;