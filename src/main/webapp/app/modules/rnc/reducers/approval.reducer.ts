import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Approval } from '../models';

// Constants
const apiUrl = 'services/all4qmsmsrnc/api/aprovacao-ncs';

// Initial State
const initialState: EntityState<Approval> = {
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

export const listApprovals = createAsyncThunk('rnc/approval/list', async ({ page, query, size, sort }: IQueryParams) => {
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

  params.push(`cacheBuster=${new Date().getTime()}`);

  const queryParams: string = params.join('&');

  const url: string = `${apiUrl}${queryParams && queryParams.length > 0 ? `?${queryParams}` : ''}`;

  return axios.get<Array<Approval>>(url, { data: {}, params: {} });
});

// Slices

const ApprovalSlice = createEntitySlice({
  name: 'rnc',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(listApprovals), (state, action) => {
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

export const { reset } = ApprovalSlice.actions;

// Reducers
export default ApprovalSlice.reducer;
