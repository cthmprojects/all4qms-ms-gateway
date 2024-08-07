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
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);
  const queryString = queryParams.join('&');

  return axios.get<Array<InfoDoc>>(`${apiDocumentacaoUrl}${queryString ? `?${queryString}` : ''}`);
});

export const createInfoDoc = createAsyncThunk('docs/create', async (data: Doc) => {
  return await axios.post<InfoDoc>(apiDocumentacaoUrl, data);
});

interface updateParams {
  id: number | string;
  data: Doc;
}
export const updateInfoDoc = createAsyncThunk('docs/update', async ({ data, id }: updateParams) => {
  return await axios.patch(`${apiDocumentacaoUrl}/${id}`, data);
});

export const deleteInfoDoc = createAsyncThunk('docs/delete', async (id: number | string) => {
  return await axios.delete(`${apiDocumentacaoUrl}/${id}`);
});

export const getInfoDocById = createAsyncThunk('docs/get', async (id: number | string) => {
  const { data } = await axios.get<Doc>(`${apiDocumentacaoUrl}/${id}`);

  const newResponse: InfoDoc = {
    doc: data,
    permissaodoc: [],
  };

  return newResponse;
});

interface cancelDocParams {
  id: number;
  userLoginID: number;
  justify: string;
}

export const cancelDocument = createAsyncThunk('docs/cancel', async ({ id, userLoginID, justify }: cancelDocParams) => {
  if (id) {
    const reproveUrl = `services/all4qmsmsinfodoc/api/infodoc/documentos/reprovacao/${id}`;
    const data = {
      idDocumento: id,
      idUsuario: userLoginID,
      justificativa: justify,
    };
    return await axios.put(reproveUrl, data);
  }
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
      })
      .addMatcher(isFulfilled(deleteInfoDoc), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(updateInfoDoc), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(cancelDocument), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(getInfoDocById), (state, action) => {
        return {
          ...state,
          loading: false,
          entity: action.payload,
        };
      });
  },
});

export const { reset } = InfoDocSlice.actions;

// Reducers
export default InfoDocSlice.reducer;
