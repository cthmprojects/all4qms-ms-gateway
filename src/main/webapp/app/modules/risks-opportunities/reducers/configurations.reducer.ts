import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Configuration } from '../models';

const apiUrl = 'services/all4qmsmsrisco/api/risco/linha-configros';

const initialState: EntityState<Configuration> = {
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

export const getConfiguration = createAsyncThunk('get/configuration', async (id: number) => {
  return axios.get<Configuration>(`${apiUrl}/${id}`);
});

export const getConfigurations = createAsyncThunk('get/configurations', async (params: ListPagination) => {
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

  return axios.get<Array<Configuration>>(url);
});

export const saveConfiguration = createAsyncThunk('save/configuration', async (configuration: Configuration) => {
  return axios.post<Configuration>(apiUrl, configuration);
});

export const updateConfiguration = createAsyncThunk('update/configuration', async (configuration: Configuration) => {
  return axios.put<Configuration>(`${apiUrl}/${configuration.id}`, configuration);
});

const configurationsSlice = createEntitySlice({
  name: 'configurations',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getConfiguration), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(getConfigurations), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
      })
      .addMatcher(isFulfilled(saveConfiguration), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(updateConfiguration), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      });
  },
});

export const { reset } = configurationsSlice.actions;

export default configurationsSlice.reducer;
