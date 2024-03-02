import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Hashtag } from '../models';

// Constants
const hashtagApiUrl = 'services/all4qmsmsrnc/api/gerar-hashtag';
const similaridadeApiUrl = 'services/all4qmsmsrnc/api/similaridade';

// Initial State
type InitialState = {
  hashtags: Hashtag[];
  loading: boolean;
};

const initialState: InitialState = {
  hashtags: [],
  loading: false,
};

// Actions

export const postHashtagRNC = createAsyncThunk('hastags-ia-rnc', async (body: string) => {
  return axios.post<Hashtag[]>(`${hashtagApiUrl}`, body);
});

const HashtagSlice = createSlice({
  name: 'hashtag',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postHashtagRNC.pending, state => {
        state.loading = true;
      })
      .addCase(postHashtagRNC.fulfilled, (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          hashtags: data,
        };
      });
  },
});

// Reducers
export default HashtagSlice.reducer;
