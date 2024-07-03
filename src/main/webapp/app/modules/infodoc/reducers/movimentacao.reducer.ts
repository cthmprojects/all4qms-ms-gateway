import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Movimentacao } from '../models';

const apiMovimentacaoUrl = 'services/all4qmsmsinfodoc/api/infodoc/movimentacao-documentos';

const initialState: EntityState<Movimentacao> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
};

export const listarmovimentacoes = createAsyncThunk('movimentacao/listar', async () => {
  return await axios.get<Array<Movimentacao>>(apiMovimentacaoUrl);
});

export const buscarMovimentacao = createAsyncThunk('movimentacao/buscar', async (id: number | string) => {
  return await axios.get<Movimentacao>(`${apiMovimentacaoUrl}/${id}`);
});

export const atualizarMovimentacao = createAsyncThunk('movimentacao/atualizar', async (data: Movimentacao) => {
  return await axios.put<Movimentacao>(`${apiMovimentacaoUrl}/${data.id}`, data);
});

export const deletarMovimentacao = createAsyncThunk('movimentacao/remover', async (id: number | string) => {
  return await axios.delete(`${apiMovimentacaoUrl}/${id}`);
});

export const cadastrarMovimentacao = createAsyncThunk('movimentacao/criar', async (data: Movimentacao) => {
  return await axios.post(apiMovimentacaoUrl, data);
});

const MovimentacaoReducer = createEntitySlice({
  name: 'movimentacao',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(cadastrarMovimentacao), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(listarmovimentacoes), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          entities: data,
          entity: null,
        };
      })
      .addMatcher(isFulfilled(buscarMovimentacao), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          entity: data,
        };
      })
      .addMatcher(isFulfilled(atualizarMovimentacao), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(deletarMovimentacao), (state, action) => {
        state.loading = false;
      });
  },
});

export default MovimentacaoReducer.reducer;
