import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { toOption } from '../mappers';
import { Enumerador, Enums } from '../models';

const apiUrl = 'services/all4qmsmsmetaind/api/metaind/enumeradores';

const initialState: EntityState<Enums> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {
    frequencies: [],
    trends: [],
    units: [],
  },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getFrequencies = createAsyncThunk('get/enums/frequencies', async () => {
  return axios.get<Array<Enumerador>>(`${apiUrl}/temporal`);
});

export const getTrends = createAsyncThunk('get/enums/trends', async () => {
  return axios.get<Array<Enumerador>>(`${apiUrl}/tendencia`);
});

export const getUnits = createAsyncThunk('get/enums/units', async () => {
  return axios.get<Array<Enumerador>>(`${apiUrl}/unidade`);
});

const enumsSlice = createEntitySlice({
  name: 'enums',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getFrequencies), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          frequencies: action.payload.data.map(r => toOption(r)),
        };
      })
      .addMatcher(isFulfilled(getTrends), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          trends: action.payload.data.map(r => toOption(r)),
        };
      })
      .addMatcher(isFulfilled(getUnits), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          units: action.payload.data.map(r => toOption(r)),
        };
      });
  },
});

export const { reset } = enumsSlice.actions;

export default enumsSlice.reducer;
