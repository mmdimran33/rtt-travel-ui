import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "./company";

import {
  addCompanyApi,
  deleteCompanyApi,
  fetchAllCompany,
  updateCompanyApi,
} from "./company.api";

interface CompanyState {
  companies: CompanyResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
};

/**
 * GET companies
 */
export const fetchAllCompanies = createAsyncThunk<
  CompanyResponse[],
  void,
  { rejectValue: string }
>("company/fetchAllCompanies", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllCompany();
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch companies"
    );
  }
});

/**
 * CREATE company
 */
export const createCompany = createAsyncThunk<
  CompanyResponse,
  CreateCompanyRequest,
  { rejectValue: string }
>("company/createCompany", async (companyData, { rejectWithValue }) => {
  try {
    return await addCompanyApi(companyData);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create company"
    );
  }
});

/**
 * UPDATE company
 */
export const updateCompany = createAsyncThunk<
  CompanyResponse,
  {
    companyId: number;
    companyData: UpdateCompanyRequest;
  },
  { rejectValue: string }
>(
  "company/updateCompany",
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      return await updateCompanyApi(companyId, companyData);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update company"
      );
    }
  }
);

/**
 * DELETE company
 */
export const deleteCompany = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("company/deleteCompany", async (companyId, { rejectWithValue }) => {
  try {
    await deleteCompanyApi(companyId);

    return companyId;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete company"
    );
  }
});

const companySlice = createSlice({
  name: "company",
  initialState,

  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // FETCH
      // =========================
      .addCase(fetchAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })

      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch companies";
      })

      // =========================
      // CREATE
      // =========================
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;

        state.companies.unshift(action.payload);
      })

      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to create company";
      })

      // =========================
      // UPDATE
      // =========================
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.companies.findIndex(
          (company) => company.id === action.payload.id
        );

        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })

      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to update company";
      })

      // =========================
      // DELETE
      // =========================
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;

        state.companies = state.companies.filter(
          (company) => company.id !== action.payload
        );
      })

      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to delete company";
      });
  },
});

export const { clearCompanyError } =
  companySlice.actions;

export default companySlice.reducer;