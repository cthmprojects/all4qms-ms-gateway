import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Process } from '../models';

const initialState: EntityState<Process> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

const apiUrl = 'services/all4qmsmsgateway/api/processos';

export const getProcesses = createAsyncThunk('rnc/process/list', async () => {
  return axios.get<Array<Process>>(`${apiUrl}`);
});

const RncProcess = createEntitySlice({
  name: 'process',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getProcesses), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isPending(getProcesses), (state, _) => {
        state.loading = true;
      });
  },
});

export const { reset } = RncProcess.actions;

export default RncProcess.reducer;
