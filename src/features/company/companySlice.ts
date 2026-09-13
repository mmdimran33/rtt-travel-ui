import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CompanyResponse } from './company';
import { addCompanyApi, fetchAllCompany } from './company.api';

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

export const fetchAllCompanies = createAsyncThunk<CompanyResponse[], void>(
  'company/fetchAllCompanies',
  async () => {
    return await fetchAllCompany();
  },
);

export const createCompany = createAsyncThunk<CompanyResponse, any>(
  'company/addCompany',
  async (companyData) => {
    return await addCompanyApi(companyData);
  },
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message ?? 'Failed to fetch companies';
      })
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
        state.error = action.error.message ?? 'Failed to add company';
      });
  },
});

export const { clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
