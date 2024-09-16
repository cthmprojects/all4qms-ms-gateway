import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Decision } from '../models/decision';

const initialState: EntityState<Decision> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

const apiUrl = 'services/all4qmsmsrnc/api/decisao';

export const saveDecision = createAsyncThunk('decision/save', async (entity: Decision) => {
  const result = await axios.post(apiUrl, {
    descricaoDecisao: entity.description,
    dataDecisao: entity.date,
    qtdAtual: entity.current,
    qtdAprovada: entity.approved,
    qtdReprovada: entity.reproved,
    qtdRejeitada: entity.rejected,
    responsaveis: entity.responsibles,
    idDecisaoAtual: null,
    tipoDecisao: entity.type.toUpperCase(),
    idNaoConformidade: entity.rncId,
  });
  return result.data;
});

export const updateDecision = createAsyncThunk('decision/update', async (entity: Decision) => {
  const result = await axios.patch(`${apiUrl}/${entity.id}`, {
    descricaoDecisao: entity.description,
    dataDecisao: entity.date,
    qtdAtual: entity.current,
    qtdAprovada: entity.approved,
    qtdReprovada: entity.reproved,
    qtdRejeitada: entity.rejected,
    responsaveis: entity.responsibles,
    id: entity.id,
    idDecisaoAtual: 0,
    tipoDecisao: entity.type.toUpperCase(),
    idNaoConformidade: entity.rncId,
  });
  return result.data;
});

export const findDecision = createAsyncThunk('decision/find', async (id: number) => {
  try {
    const result = await axios.get(`${apiUrl}/${id}`);
    return result.data;
  } catch (err) {
    return null;
  }
});

export const findDecisionByRnc = createAsyncThunk('decision/rnc', async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/byidnc/${id}`);
  return response;
});

const RncDecision = createEntitySlice({
  name: 'decision',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(saveDecision), (state, action) => {
      state.loading = false;
      state.entity = action.payload;
    }),
      builder.addMatcher(isFulfilled(updateDecision), (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.updateSuccess = true;
      });
    builder.addMatcher(isFulfilled(findDecision), (state, action) => {
      state.loading = false;
      state.entity = action.payload;
    });
    builder.addMatcher(isFulfilled(findDecisionByRnc), (state, action) => {
      state.loading = false;
      state.entity = action.payload.data;
      state.entities = action.payload.data;
    });
  },
});

export const { reset } = RncDecision.actions;

export default RncDecision.reducer;
