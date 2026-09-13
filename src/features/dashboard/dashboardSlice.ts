import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DashboardResponse } from "./dashboard";
import { fetchDashboardData } from "./dashboardApi";

interface DashboardState {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDashboardData();

      if (!response.success) {
        return rejectWithValue(
          response.message || "Failed to fetch dashboard data"
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Loading
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Success
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })

      // Error
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Unable to load dashboard data";
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;