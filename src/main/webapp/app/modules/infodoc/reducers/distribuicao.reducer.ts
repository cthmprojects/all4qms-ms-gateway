import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Movimentacao } from '../models';
import { ListPagination } from '../../goals-objectives/reducers/metas-list.reducer';
import { buildQueryParams } from '../../strategic-planning/reducers/swot.reducer';
import { Distribuicao } from '../models/distribuicao';

const apiDistribuicaoUrl = 'services/all4qmsmsinfodoc/api/infodoc/distribuicao-documentos';
const apiDetailDistribuicaoUrl = 'services/all4qmsmsinfodoc/api/infodoc/detalhes-distribuicao';

const initialState: EntityState<Distribuicao> = {
  entities: [],
  entity: null,

  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
};

export const listarDistribuicao = createAsyncThunk('distribuicao/listar', async listMetasParams => {
  const query = buildQueryParams(listMetasParams);

  const url: string = `${apiDistribuicaoUrl}/paginado${query}`;
  return await axios.get<ListPagination>(url);
});

export const buscarDistribuicao = createAsyncThunk('distribuicao/buscar', async (id: number | string) => {
  return await axios.get<Distribuicao>(`${apiDistribuicaoUrl}/${id}`);
});

export const atualizarDistribuicao = createAsyncThunk('distribuicao/atualizar', async (data: Distribuicao) => {
  return await axios.put<Distribuicao>(`${apiDistribuicaoUrl}/${data.id}`, data);
});

export const deletarDistribuicao = createAsyncThunk('distribuicao/remover', async (id: number | string) => {
  return await axios.delete(`${apiDistribuicaoUrl}/${id}`);
});

export const cadastrarDistribuicao = createAsyncThunk('distribuicao/criar', async (data: Distribuicao) => {
  return await axios.post(apiDistribuicaoUrl, data);
});

const DistribuicaoReducer = createEntitySlice({
  name: 'movimentacao',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(cadastrarDistribuicao), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(listarDistribuicao), (state, action) => {
        return {
          ...state,
          entities: action.payload.data.content,
          entity: null,
        };
      })
      .addMatcher(isFulfilled(buscarDistribuicao), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          entity: data,
        };
      })
      .addMatcher(isFulfilled(atualizarDistribuicao), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(deletarDistribuicao), (state, action) => {
        state.loading = false;
      });
  },
});

export default DistribuicaoReducer.reducer;
