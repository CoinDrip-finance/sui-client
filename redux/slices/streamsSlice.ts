import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StreamsRepository } from '../../repositories/StreamsRepository';
import { IStreamResource } from '../../types';

const initialState: {
  streams: Array<IStreamResource>;
  currentPage: number;
  status: "idle" | "loading" | "completed" | "error";
} = {
  streams: [],
  currentPage: 0,
  status: "idle",
};

export const fetchStreams = createAsyncThunk(
  "streams/fetchStreams",
  async ({ address, nfts, reset }: { address?: string; nfts?: number[]; reset?: boolean }, thunkApi) => {
    const {
      streams: { currentPage, status },
    } = thunkApi.getState() as any;

    if (status === "completed") {
      return { streams: [], reset: false, count: 0, nextPage: 0 };
    }

    const streamsRepository = new StreamsRepository();
    const { data, count } = await streamsRepository.paginate({ address, nfts, page: currentPage });

    const nextPage = currentPage + 1;
    return { streams: data, reset: !!reset, count, nextPage };
  }
);

const streamListSlice = createSlice({
  initialState,
  name: "streams",
  reducers: {
    addStream: (state, action: PayloadAction<IStreamResource>) => {
      state.streams = [action.payload, ...state.streams];
    },
    removeStream: (state, action: PayloadAction<number>) => {
      state.streams = state.streams.filter((e) => e.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreams.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStreams.rejected, (state) => {
        state.status = "error";
      })
      .addCase(fetchStreams.fulfilled, (state, action) => {
        if (state.status !== "completed") {
          state.currentPage = action.payload.nextPage;
          if (action.payload.reset) {
            state.streams = action.payload.streams;
          } else {
            state.streams.push(...action.payload.streams);
          }

          if (state.streams?.length === action.payload.count) {
            state.status = "completed";
          } else {
            state.status = "idle";
          }
        }
      });
  },
});

export const { addStream, removeStream } = streamListSlice.actions;
export default streamListSlice.reducer;
