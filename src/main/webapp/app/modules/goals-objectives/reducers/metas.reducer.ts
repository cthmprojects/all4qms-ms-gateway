import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { ListMeta, Meta } from '../models/goals';

const apiUrl = 'services/all4qmsmsmetaind/api/metaobj/metas/';

const initialState: EntityState<Meta> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getMeta = createAsyncThunk('get/meta', async (id: number) => {
  return axios.get<Meta>(`${apiUrl}/${id}`);
});

export const saveMeta = createAsyncThunk('set/meta', async (meta: Meta) => {
  return axios.post<Meta>(apiUrl, meta);
});
const metasSlice = createEntitySlice({
  name: 'metas',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getMeta), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(saveMeta), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      });
  },
});

export const { reset } = metasSlice.actions;

export default metasSlice.reducer;
