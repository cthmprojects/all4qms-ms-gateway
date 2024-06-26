import { Permissao } from '../models/permissao';

import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const apiPermissaoListUrl = 'services/all4qmsmsinfodoc/api/infodoc/permissao-documentos/bylistprocesso';
const apiPermissaoByIdUrl = 'services/all4qmsmsinfodoc/api/infodoc/permissao-documentos/byprocesso/';

// Initial State
const initialState: EntityState<Permissao> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

export const getPermissaolist = createAsyncThunk('permissao/list', async () => {
  const url = apiPermissaoListUrl;
  return axios.get<Array<Permissao>>(url);
});

export const getPermissaoById = createAsyncThunk('permissao/id', async (id: number) => {
  const url = `${apiPermissaoByIdUrl}/${id}`;
  const response = await axios.get(url);
  return response;
});

const PermissaoSlice = createEntitySlice({
  name: 'permissao',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isPending(getPermissaolist), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(getPermissaolist), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(getPermissaoById), (state, action) => {
        const { data } = action.payload;
        state.updating = false;
        state.loading = false;
        state.entity = data;
      });
  },
});

export const { reset } = PermissaoSlice.actions;

// Reducers
export default PermissaoSlice.reducer;
