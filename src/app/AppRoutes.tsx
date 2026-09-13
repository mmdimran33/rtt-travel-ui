import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";

import Tenant from "../features/tenant/Tenant";
import { User } from "../features/user/User";
import Company from "../features/company/Company";
import Candidate from "../features/candidate/Candidate";
import Document from "../features/document/Document";
import Visa from "../features/visa/Visa";
import Medical from "../features/medical/Medical";
import Contract from "../features/contract/Contract";
import Departure from "../features/departure/Departure";
import Arrival from "../features/arrival/Arrival";
import Payment from "../features/payment/Payment";
import VendorHome from "../features/vendor/VendorHome";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./config/ProtectedRoute";
import RoleProtectedRoute from "./config/RoleProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================================
          PUBLIC ROUTES
      ================================= */}
      <Route path="/login" element={<Login />} />

      {/* ================================
          PROTECTED ROUTES
      ================================= */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ================================
            SUPER_ADMIN + ADMIN
        ================================= */}

        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={["SUPER_ADMIN", "ADMIN"]}
            >
              <Dashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/tenants"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <Tenant />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
              <User />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/companies"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "COMPANY_USER"]}>
              <Company />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/candidates"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "COMPANY_USER", "VENDOR_USER"]}>
              <Candidate />
            </RoleProtectedRoute>
          }
        />
   {/*  
        <Route
          path="/documents"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
              <Document />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/visas"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
              <Visa />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/medical"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
              <Medical />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/contracts"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
              <Contract />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/departures"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "TENANT_ADMIN"]}>
              <Departure />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/arrivals"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "TENANT_ADMIN"]}>
              <Arrival />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "TENANT_ADMIN"]}>
              <Payment />
            </RoleProtectedRoute>
          }
        />
        */}

        {/* ================================
            VENDOR ONLY
        ================================= */}

        <Route
          path="/vendor"
          element={
            <RoleProtectedRoute allowedRoles={["VENDOR"]}>
              <VendorHome />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;