import { Charts, DataChart, MetaPeriodo } from '../models/charts';
import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState: EntityState<Charts> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {
    metaPeriodo: [],
    comparacaoPeriodo: [],
    metaProcesso: [],
    preenchimentoIndicadores: [],
    idIndicador: 0,
    idProcesso: 0,
    anoIndicador: '',
    qualidadeProducao: 0,
    variacao: 0,
  },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const indicadoresChartsApiUrl = 'services/all4qmsmsmetaind/api/indicadores/graficos';

interface ListParams {
  anoIndicador?: string;
  idIndicador: number;
  idProcesso: number;
}

export const getMetasPeriodo = createAsyncThunk('charts/metasPeriodo', async (params: ListParams) => {
  const { anoIndicador, idIndicador, idProcesso } = params;

  const queryParams: string[] = [];

  if (idIndicador) {
    queryParams.push(`indicador=${idIndicador}`);
  }

  if (idProcesso) {
    queryParams.push(`processo=${idProcesso}`);
  }

  if (anoIndicador) {
    queryParams.push(`ano=${anoIndicador}`);
  }

  const queryString = queryParams.join('&');

  return axios.get<Array<MetaPeriodo>>(`${indicadoresChartsApiUrl}/metas-periodo${queryString ? `?${queryString}` : ''}`);
});

export const getQualidadeProducao = createAsyncThunk('charts/qualidadeProducao', async (params: ListParams) => {
  const { anoIndicador, idIndicador, idProcesso } = params;

  const queryParams: string[] = [];

  if (idIndicador) {
    queryParams.push(`indicador=${idIndicador}`);
  }

  if (idProcesso) {
    queryParams.push(`processo=${idProcesso}`);
  }

  if (anoIndicador) {
    queryParams.push(`ano=${anoIndicador}`);
  }

  const queryString = queryParams.join('&');

  return axios.get<Array<MetaPeriodo>>(`${indicadoresChartsApiUrl}/producao${queryString ? `?${queryString}` : ''}`);
});

export const getPreenchimentoIndicadores = createAsyncThunk('charts/preenchimentoIndicadores', async (params: ListParams) => {
  const { anoIndicador, idIndicador, idProcesso } = params;

  const queryParams: string[] = [];

  if (idIndicador) {
    queryParams.push(`indicador=${idIndicador}`);
  }

  if (idProcesso) {
    queryParams.push(`processo=${idProcesso}`);
  }

  if (anoIndicador) {
    queryParams.push(`ano=${anoIndicador}`);
  }

  const queryString = queryParams.join('&');

  return axios.get<Array<MetaPeriodo>>(`${indicadoresChartsApiUrl}/preenchimento-indicadores${queryString ? `?${queryString}` : ''}`);
});

export const getMetasProcesso = createAsyncThunk('charts/metasProcesso', async (params: ListParams) => {
  const { anoIndicador, idIndicador, idProcesso } = params;

  const queryParams: string[] = [];

  if (idIndicador) {
    queryParams.push(`indicador=${idIndicador}`);
  }

  if (idProcesso) {
    queryParams.push(`processo=${idProcesso}`);
  }

  if (anoIndicador) {
    queryParams.push(`ano=${anoIndicador}`);
  }

  const queryString = queryParams.join('&');

  return axios.get<Array<MetaPeriodo>>(`${indicadoresChartsApiUrl}/metas-processo${queryString ? `?${queryString}` : ''}`);
});

export const getComparacaoPeriodo = createAsyncThunk('charts/comparacaoPeriodo', async (params: ListParams) => {
  const { anoIndicador, idIndicador, idProcesso } = params;

  const queryParams: string[] = [];

  if (idIndicador) {
    queryParams.push(`indicador=${idIndicador}`);
  }

  if (idProcesso) {
    queryParams.push(`processo=${idProcesso}`);
  }

  if (anoIndicador) {
    queryParams.push(`ano=${anoIndicador}`);
  }

  const queryString = queryParams.join('&');

  return axios.get<Array<MetaPeriodo>>(`${indicadoresChartsApiUrl}/comparacao-periodos${queryString ? `?${queryString}` : ''}`);
});

const chartsSlice = createEntitySlice({
  name: 'charts',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getMetasPeriodo), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          metaPeriodo: action.payload.data['dados'],
        };
      })
      .addMatcher(isFulfilled(getQualidadeProducao), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          qualidadeProducao: action.payload.data['qualidadeProducao'],
          variacao: action.payload.data['variacao'],
        };
      })
      .addMatcher(isFulfilled(getPreenchimentoIndicadores), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          preenchimentoIndicadores: action.payload.data['dados'],
        };
      })
      .addMatcher(isFulfilled(getMetasProcesso), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          metaProcesso: action.payload.data['dados'],
        };
      })
      .addMatcher(isFulfilled(getComparacaoPeriodo), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          comparacaoPeriodo: action.payload.data['dados'],
        };
      });
  },
});

export const { reset } = chartsSlice.actions;

export default chartsSlice.reducer;
