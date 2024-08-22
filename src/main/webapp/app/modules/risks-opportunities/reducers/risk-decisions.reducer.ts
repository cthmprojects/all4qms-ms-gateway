import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Configuration } from '../models';

const apiUrl = 'services/all4qmsmsrisco/api/risco/linha-configros';

const initialState: EntityState<Configuration> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getRiskDecisions = createAsyncThunk('get/decisions', async () => {
  return axios.get<Array<Configuration>>(`${apiUrl}/tipo-ro-analise?tipoRO=R&tipoAnaliseRO=D`);
});

const riskDecisionsSlice = createEntitySlice({
  name: 'riskDecisions',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(getRiskDecisions), (state, action) => {
      state.loading = false;
      state.entities = action.payload.data;
    });
  },
});

export const { reset } = riskDecisionsSlice.actions;

export default riskDecisionsSlice.reducer;
