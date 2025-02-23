import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Indicador, Indicator } from '../models';
import { toIndicator, toRawIndicator } from '../mappers';

const apiUrl = 'services/all4qmsmsmetaind/api/indicadores';

const initialState: EntityState<Indicator> = {
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

export const getIndicator = createAsyncThunk('get/indicator', async (id: number) => {
  return axios.get<Indicador>(`${apiUrl}/${id}`);
});

export const getIndicators = createAsyncThunk('get/indicators', async (params: ListPagination) => {
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

  return axios.get<Array<Indicador>>(url);
});

export const getAllIndicators = createAsyncThunk('get/all/indicators', async () => {
  return axios.get<Array<Indicador>>(`${apiUrl}?cacheBuster=${new Date().getTime()}`);
});

export const saveIndicator = createAsyncThunk('save/indicator', async (indicator: Indicator) => {
  return axios.post<Indicador>(apiUrl, toRawIndicator(indicator));
});

export const updateIndicator = createAsyncThunk('update/indicator', async (indicator: Indicator) => {
  return axios.put<Indicador>(`${apiUrl}/${indicator.id}`, toRawIndicator(indicator));
});

const indicatorsSlice = createEntitySlice({
  name: 'indicators',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getIndicator), (state, action) => {
        state.loading = false;
        state.entity = toIndicator(action.payload.data);
      })
      .addMatcher(isFulfilled(getIndicators), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toIndicator(i));
      })
      .addMatcher(isFulfilled(getAllIndicators), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toIndicator(i));
      })
      .addMatcher(isFulfilled(saveIndicator), (state, action) => {
        state.loading = false;
        state.entity = toIndicator(action.payload.data);
      })
      .addMatcher(isFulfilled(updateIndicator), (state, action) => {
        state.loading = false;
        state.entity = toIndicator(action.payload.data);
      });
  },
});

export const { reset } = indicatorsSlice.actions;

export default indicatorsSlice.reducer;
