import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import { IUser } from '../../../shared/model/user.model';
import { IUsuario } from '../../../shared/model/usuario.model';
import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import axios from 'axios';
import { IProcesso } from 'app/shared/model/processo.model';

const apiUrl = 'api/usuarios/';
const apiByProcessUrl = 'api/usuarios/byprocesso';

// Initial State
const initialState: EntityState<IUsuario> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

export interface UerSGQ {
  id: number;
  nome: string;
  email: string;
  isGestor: boolean;
  criadoEm: null;
  atualizadoEm: null;
  funcao: Funcao;
  gestor: Gestor;
  setor: Funcao;
  user: User;
  criadoPor: Gestor;
  atualizadoPor: Gestor;
  processos: IProcesso[];
}

interface User {
  id: number;
  login: string;
}

interface Gestor {
  id: null;
  nome: null;
  email: null;
  isGestor: null;
  criadoEm: null;
  atualizadoEm: null;
  funcao: null;
  gestor: null;
  setor: null;
  user: null;
  criadoPor: null;
  atualizadoPor: null;
  processos: any[];
}

interface Funcao {
  id: number;
  nome: string;
  descricao: null;
  criadoEm: null;
  atualizadoEm: null;
  criadoPor: null;
  atualizadoPor: null;
}

export const getUsers = createAsyncThunk('usuario', async ({ page, query, size, sort }: IQueryParams) => {
  const params: Array<string> = [];

  if (page) {
    params.push(`page=${page}`);
  }

  if (size) {
    params.push(`size=${size}`);
  }

  if (sort) {
    params.push(`sort=${sort}`);
  }

  const queryParams: string = params.join('&');

  const url: string = `${apiUrl}${queryParams ? `?${queryParams}` : ''}`;

  return axios.get<Array<IUsuario>>(url, { data: {}, params: {} });
});

export const getUsersByProcess = createAsyncThunk('usuario/get-byprocess', async (id: number | string) => {
  return await axios.get<UerSGQ[]>(`${apiByProcessUrl}/${id}`);
});

const RncSlice = createEntitySlice({
  name: 'usuario',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(getUsers), (state, action) => {
      const { data, headers } = action.payload;

      return {
        ...state,
        loading: false,
        entities: data,
        totalItems: parseInt(headers['x-total-count'], 10),
      };
    });
  },
});

export const { reset } = RncSlice.actions;
export default RncSlice.reducer;
