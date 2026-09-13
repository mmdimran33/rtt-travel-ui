import { configureStore } from '@reduxjs/toolkit';
import tenantReducer from '../features/tenant/tenantSlice';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import companyReducer from '../features/company/companySlice';
import dashboardReducer from "../features/dashboard/dashboardSlice";
import candidateReducer from "../features/candidate/candidateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    company: companyReducer,
    users: userReducer,
    dashboard: dashboardReducer,
    candidate: candidateReducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
