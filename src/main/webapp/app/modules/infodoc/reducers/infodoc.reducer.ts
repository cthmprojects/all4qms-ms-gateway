import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Doc, DocumentacaoRequest, InfoDoc } from '../models';

const apiDocumentacaoUrl = 'services/all4qmsmsinfodoc/api/infodoc/documentos';

// Initial State
const initialState: EntityState<InfoDoc> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

interface ListParams {
  situacao?: string;
  origem?: string;
  dtIni?: Date;
  dtFim?: Date;
  page?: number;
  size?: number;
  pesquisa?: string;
  idProcesso?: number;
}

export const listdocs = createAsyncThunk('docs/list', async (params: ListParams) => {
  const { dtIni, dtFim, idProcesso, origem, situacao, pesquisa, page, size } = params;

  const queryParams: string[] = [];

  queryParams.push('sort=desc');

  if (dtIni) {
    queryParams.push(`dtIni=${dtIni}`);
  }

  if (dtFim) {
    queryParams.push(`dtFim=${dtFim}`);
  }

  if (idProcesso) {
    queryParams.push(`idProcesso=${idProcesso}`);
  }

  if (origem) {
    queryParams.push(`origem=${origem}`);
  }

  if (situacao) {
    queryParams.push(`situacao=${situacao}`);
  }

  if (pesquisa) {
    queryParams.push(`pesquisa=${pesquisa}`);
  }

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);
  const queryString = queryParams.join('&');

  return axios.get<Array<InfoDoc>>(`${apiDocumentacaoUrl}${queryString ? `?${queryString}` : ''}`);
});

export const createInfoDoc = createAsyncThunk('docs/create', async (data: Doc) => {
  return await axios.post<InfoDoc>(apiDocumentacaoUrl, data);
});

const InfoDocSlice = createEntitySlice({
  name: 'infodoc',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isPending(listdocs), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(listdocs), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createInfoDoc), (state, action) => {
        state.loading = false;
      });
  },
});

export const { reset } = InfoDocSlice.actions;

// Reducers
export default InfoDocSlice.reducer;
