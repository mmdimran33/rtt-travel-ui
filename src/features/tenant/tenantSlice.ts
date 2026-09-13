import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTenantsAPI, createTenantAPI } from './tenantAPI';
import type { TenantResponse, CreateTenantRequest } from './tenant';

interface TenantState {
  tenants: TenantResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenants: [],
  loading: false,
  error: null,
};

export const fetchTenants = createAsyncThunk(
  'tenant/fetchTenants',
  async () => {
    return await fetchTenantsAPI();
  }
);

export const createTenant = createAsyncThunk(
  'tenant/createTenant',
  async (tenant: CreateTenantRequest) => {
    return await createTenantAPI(tenant);
  }
);

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.tenants.push(action.payload);
      });
  },
});

export default tenantSlice.reducer;