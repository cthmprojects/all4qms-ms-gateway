import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { DocumentacaoRequest, InfoDoc } from '../models';

const apiDocumentacaoUrl = 'services/all4qms-ms-infodoc/api/documentacaos';

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
  dtFim?: string;
  page?: number;
  size?: number;
  pesquisa?: string;
  idProcesso?: number;
}

export const listdocs = createAsyncThunk('docs/list', async (params: ListParams) => {
  const { situacao, origem, idProcesso, dtIni, pesquisa, page, size } = params;
  const requestDoc: DocumentacaoRequest = {
    dtIni,
    idProcesso,
    origem,
    situacao,
    pesquisa,
  };

  const url = apiDocumentacaoUrl;

  return axios.get<Array<InfoDoc>>(url);
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
      });
  },
});

export const { reset } = InfoDocSlice.actions;

// Reducers
export default InfoDocSlice.reducer;
