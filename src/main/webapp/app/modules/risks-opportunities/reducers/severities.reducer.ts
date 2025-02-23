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

export const getSeverities = createAsyncThunk('get/severities', async () => {
  return axios.get<Array<Configuration>>(`${apiUrl}/tipo-ro-analise?tipoRO=R&tipoAnaliseRO=S`);
});

const severitiesSlice = createEntitySlice({
  name: 'severities',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(getSeverities), (state, action) => {
      state.loading = false;
      state.entities = action.payload.data;
    });
  },
});

export const { reset } = severitiesSlice.actions;

export default severitiesSlice.reducer;
