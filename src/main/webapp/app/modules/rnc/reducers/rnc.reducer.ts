import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { RNC, Rnc, RncDescription } from '../models';

// Constants
const apiUrl = 'services/all4qmsmsrnc/api/nao-conformidades';
const descriptionApiUrl = 'services/all4qmsmsrnc/api/descricao-nao-conformidades';

// Initial State
const initialState: EntityState<Rnc> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

// Actions
export const remove = createAsyncThunk('rnc/delete', async ({ page, query, size, sort }: IQueryParams) => {});

export const find = createAsyncThunk('rnc/find', async ({ page, query, size, sort }: IQueryParams) => {});

export const list = createAsyncThunk('rnc/list', async ({ page, query, size, sort }: IQueryParams) => {
  const params: Array<string> = [];

  if (page) {
    params.push(`page=${page}`);
  }

  if (size) {
    params.push(`size=${size}`);
  }

  if (sort) {
    params.push(`sort=${sort}`);
  }

  params.push(`cacheBuster=${new Date().getTime()}`);

  const queryParams: string = params.join('&');

  const url: string = `${apiUrl}${queryParams && queryParams.length > 0 ? `?${queryParams}` : ''}`;

  return axios.get<Array<Rnc>>(url, { data: {}, params: {} });
});

export const save = createAsyncThunk('rnc/save', async (rnc: Rnc) => {
  const response = await axios.post(apiUrl, rnc);
  return response;
});

export const update = createAsyncThunk('rnc/update', async ({ page, query, size, sort }: IQueryParams) => {});

export const saveDescription = createAsyncThunk('rnc/description/save', async (description: RncDescription) => {
  const response = await axios.post(descriptionApiUrl, {
    detalhesNaoConformidade: description.details,
    requisitoDescumprido: description.requirement,
    evidenciaObjetiva: description.evidence,
    idNaoConformidade: description.rncId,
  });
  return response;
});

// Slices

const RncSlice = createEntitySlice({
  name: 'rnc',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(list), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(save), (state, action) => {
        const { data } = action.payload;

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = data;
      })
      .addMatcher(isFulfilled(saveDescription), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      });
  },
});

export const { reset } = RncSlice.actions;

// Reducers
export default RncSlice.reducer;
