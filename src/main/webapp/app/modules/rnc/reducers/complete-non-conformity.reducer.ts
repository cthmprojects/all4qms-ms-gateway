import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { CompleteNc } from '../models';

// Constants

const apiUrl = 'services/all4qmsmsrnc/api/nao-conformidades';

// Initial State

const initialState: EntityState<CompleteNc> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

// Actions

export const findCompleteNonConformity = createAsyncThunk('complete-non-conformity/find', async (id: number) => {
  const queryParams: Array<string> = [];
  queryParams.push(`cacheBuster=${new Date().getTime()}`);
  const queryString: string = queryParams.join('&');
  const query: string = queryString ? `?${queryString}` : '';

  const url = `${apiUrl}/complete/${id}/${query}`;
  return axios.get<CompleteNc>(url);
});

// Slices

const CompleteNonConformitySlice = createEntitySlice({
  name: 'complete-non-conformity',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isPending(findCompleteNonConformity), (state, _) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(findCompleteNonConformity), (state, action) => {
        const { data } = action.payload;

        state.loading = false;
        state.entity = data;
      });
  },
});

export const { reset } = CompleteNonConformitySlice.actions;

// Reducers
export default CompleteNonConformitySlice.reducer;
