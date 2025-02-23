import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { TargetGoals, Goals } from '../models/goals';

const apiUrl = 'services/all4qmsmsgoalsobjectives/api/goals-objectives/documentos';

export const createGoals = createAsyncThunk('goals/create', async (data: TargetGoals) => {
  return await axios.post<Goals>(apiUrl, data);
});
