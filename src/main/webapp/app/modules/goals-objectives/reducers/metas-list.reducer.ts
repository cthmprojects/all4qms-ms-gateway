import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { ListMeta, Meta } from '../models/goals';

const apiUrl = 'services/all4qmsmsmetaind/api/metaobj/metas/';

const initialState: EntityState<ListPaginationMeta> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {
    totalPages: 0,
    totalElements: 0,
    size: 0,
    content: [],
    number: 0,
    sort: {},
    numberOfElements: 0,
    pageable: {},
    first: false,
    last: false,
    empty: false,
  },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export interface ListPaginationMeta {
  totalPages: number;
  totalElements: number;
  size: number;
  content: [];
  number: number;
  sort: Sort;
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Pageable {
  offset?: number;
  sort?: Sort;
  unpaged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  paged?: boolean;
}

export interface Sort {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface ListMetasInterface {
  idProcesso?: number;
  ano?: string | Date;
  mes?: string | Date;
  situacao?: string;
  pesquisa?: string;
  page?: number;
  size?: number;
}

export const getAllMetasFilter = createAsyncThunk('get/metas-list', async (listMetasParams: ListMetasInterface) => {
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
  const url: string = `${apiUrl}/filtro${urlParams}`;

  return axios.post<ListPaginationMeta>(url, listMetasParams);
});

const metasListaSlice = createEntitySlice({
  name: 'metasLista',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(getAllMetasFilter), (state, action) => {
      state.loading = false;
      state.entity = action.payload.data;
    });
  },
});

export const { reset } = metasListaSlice.actions;

export default metasListaSlice.reducer;
