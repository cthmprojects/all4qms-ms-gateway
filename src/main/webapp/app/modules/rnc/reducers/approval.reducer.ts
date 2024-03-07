import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { AprovacaoNC } from '../models';

const initialState: EntityState<AprovacaoNC> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

const apiUrl = 'services/all4qmsmsrnc/api/aprovacao-ncs';

export const saveApprovalNC = createAsyncThunk('approval/save', async (entity: AprovacaoNC) => {
  const result = await axios.post(apiUrl, entity);
  return result.data;
});

export const updateApprovalNC = createAsyncThunk('approval/update', async (entity: AprovacaoNC) => {
  const result = await axios.patch(`${apiUrl}/${entity.id}`, entity);
  return result.data;
});

export const getApprovalNC = createAsyncThunk('approval/fetch', async (id: number) => {
  try {
    const result = await axios.get(`${apiUrl}/${id}`);
    return result.data;
  } catch (err) {
    return null;
  }
});

const RncApproval = createEntitySlice({
  name: 'approval',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(saveApprovalNC), (state, action) => {
      state.loading = false;
      state.entity = action.payload;
    }),
      builder.addMatcher(isFulfilled(updateApprovalNC), (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      });
    builder.addMatcher(isFulfilled(getApprovalNC), (state, action) => {
      state.loading = false;
      state.entity = action.payload;
    });
  },
});

export const { reset } = RncApproval.actions;

export default RncApproval.reducer;
