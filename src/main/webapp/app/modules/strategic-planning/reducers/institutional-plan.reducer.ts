import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { toInstitutionalPlan, toRawInstitutionalPlan } from '../mappers';
import { InstitutionalPlan, RawInstitutionalPlan } from '../models';

const apiUrl = 'services/tbd';

const initialState: EntityState<InstitutionalPlan> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

interface ListPagination {
  page?: number;
  size?: number;
}

export const getInstitutionalPlan = createAsyncThunk('get/institutionalPlan', async (id: number) => {
  return axios.get<RawInstitutionalPlan>(`${apiUrl}/${id}`);
});

export const getInstitutionalPlans = createAsyncThunk('get/institutionalPlans', async (params: ListPagination) => {
  const { page, size } = params;

  const queryParams: Array<string> = [];

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const query: string = queryParams.join('&');
  const urlParams: string = query ? `?${query}` : '';
  const url: string = `${apiUrl}${urlParams}`;

  return axios.get<Array<RawInstitutionalPlan>>(url);
});

export const getAllInstitutionalPlans = createAsyncThunk('get/all/institutionalPlans', async () => {
  return axios.get<Array<RawInstitutionalPlan>>(`${apiUrl}`);
});

export const saveInstitutionalPlan = createAsyncThunk('save/institutionalPlan', async (institutionalPlan: InstitutionalPlan) => {
  return axios.post<RawInstitutionalPlan>(apiUrl, toRawInstitutionalPlan(institutionalPlan));
});

export const updateInstitutionalPlan = createAsyncThunk('update/institutionalPlan', async (institutionalPlan: InstitutionalPlan) => {
  return axios.put<RawInstitutionalPlan>(`${apiUrl}/${institutionalPlan.id}`, toRawInstitutionalPlan(institutionalPlan));
});

const institutionalPlansSlice = createEntitySlice({
  name: 'institutionalPlans',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getInstitutionalPlan), (state, action) => {
        state.loading = false;
        state.entity = toInstitutionalPlan(action.payload.data);
      })
      .addMatcher(isFulfilled(getInstitutionalPlans), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toInstitutionalPlan(i));
      })
      .addMatcher(isFulfilled(getAllInstitutionalPlans), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toInstitutionalPlan(i));
      })
      .addMatcher(isFulfilled(saveInstitutionalPlan), (state, action) => {
        state.loading = false;
        state.entity = toInstitutionalPlan(action.payload.data);
      })
      .addMatcher(isFulfilled(updateInstitutionalPlan), (state, action) => {
        state.loading = false;
        state.entity = toInstitutionalPlan(action.payload.data);
      });
  },
});

export const { reset } = institutionalPlansSlice.actions;

export default institutionalPlansSlice.reducer;
