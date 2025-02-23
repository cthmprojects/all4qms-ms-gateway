import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { RncDescription } from '../models';

const apiUrl = 'services/all4qmsmsrnc/api/descricao-nao-conformidades';

const initialState: EntityState<RncDescription> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getById = createAsyncThunk('description/', async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/${id}`);
  return response;
});

export const getDescriptionByRNCId = createAsyncThunk('description/rnc', async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/list/${id}`);
  return response;
});

export const getDescription = async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/list/${id}`);
  return response;
};

export const clearDescriptions = async (id: string | number) => {
  return await axios.delete(`${apiUrl}/byidrnc/${id}`);
};

const rncDescriptionSlice = createEntitySlice({
  name: 'description',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getById), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(getDescriptionByRNCId), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
        state.entity = action.payload.data.length > 0 ? action.payload.data[0] : null;
      });
  },
});

export const { reset } = rncDescriptionSlice.actions;

export default rncDescriptionSlice.reducer;
