import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { ListMeta, Meta, MetaRecurso } from '../models/goals';
import { ListPaginationMeta } from './metas-list.reducer';

const apiUrl = 'services/all4qmsmsmetaind/api/metaobj/recursos';

interface ListPagination {
  page?: number;
  size?: number;
}

const initialState: EntityState<MetaRecurso> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getAllResources = createAsyncThunk('get/resources_all', async (listMetasParams: ListPagination) => {
  const { page, size } = listMetasParams;

  const queryParams: Array<string> = [];

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  const query: string = queryParams.join('&');
  const urlParams: string = query ? `?${query}` : '';
  const url: string = `${apiUrl}${urlParams}`;

  return axios.get<ListPaginationMeta>(url);
});
export const getResource = createAsyncThunk('get/resources', async (id: number) => {
  return axios.get<MetaRecurso>(`${apiUrl}/${id}`);
});

export const saveResource = createAsyncThunk('set/resources', async (meta: Meta) => {
  return axios.post<MetaRecurso>(apiUrl, meta);
});
const resourcesSlice = createEntitySlice({
  name: 'resources',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getAllResources), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.content;
      })
      .addMatcher(isFulfilled(getResource), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(saveResource), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      });
  },
});

export const { reset } = resourcesSlice.actions;

export default resourcesSlice.reducer;
