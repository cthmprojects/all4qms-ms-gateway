import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { ListMeta, Meta, MetaObjetivo } from '../models/goals';

const apiUrl = 'services/all4qmsmsmetaind/api/metaobj/objetivos';

const initialState: EntityState<MetaObjetivo> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getMetaObjetivo = createAsyncThunk('get/meta_objetivo', async (id: Number) => {
  return axios.get<MetaObjetivo>(`${apiUrl}/${id}`);
});
export const saveMetaObjetivo = createAsyncThunk('set/meta_objetivo', async (metaObj: MetaObjetivo) => {
  return axios.post<MetaObjetivo>(apiUrl, metaObj);
});

const metaObjetivoSlice = createEntitySlice({
  name: 'metaObjetivo',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getMetaObjetivo), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(saveMetaObjetivo), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      });
  },
});

export const { reset } = metaObjetivoSlice.actions;

export default metaObjetivoSlice.reducer;
