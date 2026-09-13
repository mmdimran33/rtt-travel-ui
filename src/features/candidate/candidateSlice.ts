import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import {
  createCandidate as createCandidateApi,
  fetchAllCandidates,
  updateCandidate as updateCandidateApi,
} from "./candidate.api";
import type {
  CandidateResponse,
  CreateCandidateRequest,
  UpdateCandidateRequest,
} from "./candidate";

interface CandidateState {
  candidates: CandidateResponse[];
  error: string | null;
  loading: boolean;
}

interface UpdateCandidatePayload {
  data: UpdateCandidateRequest;
  id: number;
}

const initialState: CandidateState = {
  candidates: [],
  error: null,
  loading: false,
};

const getAccessToken = (state: RootState): string => {
  if (!state.auth.accessToken) {
    throw new Error("You must be signed in to manage candidates");
  }
  return state.auth.accessToken;
};

export const fetchCandidates = createAsyncThunk<
  CandidateResponse[],
  void,
  { state: RootState; rejectValue: string }
>("candidate/fetchCandidates", async (_payload, { getState, rejectWithValue }) => {
  try {
    return await fetchAllCandidates(getAccessToken(getState()));
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch candidates");
  }
});

export const createCandidate = createAsyncThunk<
  CandidateResponse,
  CreateCandidateRequest,
  { state: RootState; rejectValue: string }
>("candidate/createCandidate", async (data, { getState, rejectWithValue }) => {
  try {
    return await createCandidateApi(data, getAccessToken(getState()));
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to create candidate");
  }
});

export const updateCandidate = createAsyncThunk<
  CandidateResponse,
  UpdateCandidatePayload,
  { state: RootState; rejectValue: string }
>("candidate/updateCandidate", async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    return await updateCandidateApi(id, data, getAccessToken(getState()));
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to update candidate");
  }
});

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    clearCandidateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch candidates";
      })
      .addCase(createCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates.unshift(action.payload);
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create candidate";
      })
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.candidates.findIndex((candidate) => candidate.id === action.payload.id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update candidate";
      });
  },
});

export const { clearCandidateError } = candidateSlice.actions;
export default candidateSlice.reducer;
