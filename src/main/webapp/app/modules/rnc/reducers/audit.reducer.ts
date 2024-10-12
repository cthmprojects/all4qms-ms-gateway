import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { GeneralAudit } from '../models';

const apiUrl = 'services/all4qmsmsrnc/api/auditorias';

const initialState: EntityState<GeneralAudit> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const findAudit = createAsyncThunk('audit/', async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/${id}`);
  return response;
});

const rncAuditSlice = createEntitySlice({
  name: 'audit',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(findAudit), (state, action) => {
      state.loading = false;
      const data = action.payload.data;

      state.entity = {
        ncNumber: data.ocorrenciaAuditoria,
        norm: data.normaAuditoria,
        normRequirements: data.requisitoAuditoria,
        reportNumber: data.processoAuditoria,
      };
    });
  },
});

export const { reset: resetAudit } = rncAuditSlice.actions;

export default rncAuditSlice.reducer;
