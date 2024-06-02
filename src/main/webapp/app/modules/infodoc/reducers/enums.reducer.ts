import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Enums } from '../models';

const enumsApiUrl = 'services/all4qmsmsinfodoc/api/infodoc/enumeradores';

type InitialState = {
  enums: Enums | null;
  loading: boolean;
};

const initialState: InitialState = {
  enums: null,
  loading: false,
};

export const listEnums = createAsyncThunk('infodoc/enums/all', async () => {
  const response = await axios.get(`${enumsApiUrl}/all`);

  if (response.status !== 200) {
    return null;
  }

  return response.data;
});

const EnumsSlice = createSlice({
  name: 'enums',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(listEnums.pending, state => {
        state.loading = true;
      })
      .addCase(listEnums.fulfilled, (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          enums: data,
        };
      });
  },
});
