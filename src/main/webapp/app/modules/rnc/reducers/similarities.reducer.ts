import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Constants
const similaridadeApiUrl = 'services/all4qmsmsrnc/api/ia/similaridade';

// Initial State
type InitialState = {
  similarities: Array<number>;
  loading: boolean;
};

const initialState: InitialState = {
  similarities: [],
  loading: false,
};

// Actions

export const findSimilarities = createAsyncThunk('ai/rnc/similarities', async (body: string) => {
  return axios.post<Array<number>>(similaridadeApiUrl, body);
});

export const getSimilarities = async (body: string): Promise<Array<number>> => {
  const response = await axios.post<Array<number>>(similaridadeApiUrl, body);

  return response.status === 200 ? response.data : [];
};

const SimilaritySlice = createSlice({
  name: 'similarity',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(findSimilarities.pending, state => {
        state.loading = true;
      })
      .addCase(findSimilarities.fulfilled, (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          similarities: data,
        };
      });
  },
});

// Reducers
export default SimilaritySlice.reducer;
