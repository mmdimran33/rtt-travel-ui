import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";

import api from "../../app/config/axios";

import type {
  BaseResponse,
  CreateTenantRequest,
  TenantResponse,
} from "./tenant";

const initialFormData: CreateTenantRequest = {
  employeeCode: "",
  tenantName: "",
  contactPerson: "",
  email: "",
  mobile: "",
  country: "",
  state: "",
  city: "",
  address: "",
};

const Tenant = () => {
  const [tenants, setTenants] = useState<TenantResponse[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [formData, setFormData] =
    useState<CreateTenantRequest>(initialFormData);

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CreateTenantRequest, string>>
  >({});

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  /**
   * Fetch tenant data
   */
  const fetchTenants = async () => {
    try {
      setLoading(true);

      const response =
        await api.get<BaseResponse<TenantResponse[]>>(
          "/tenants"
        );

      if (response.data.success) {
        setTenants(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tenants:", error);

      showSnackbar(
        "Failed to load tenant data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  /**
   * Form input change
   */
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const errors: Partial<
      Record<keyof CreateTenantRequest, string>
    > = {};

    if (!formData.employeeCode.trim()) {
      errors.employeeCode = "Employee code is required";
    }

    if (!formData.tenantName.trim()) {
      errors.tenantName = "Tenant name is required";
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = "Contact person is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Enter a valid email";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    }

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /**
   * Create new tenant
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post<BaseResponse<TenantResponse>>(
          "/tenants",
          formData
        );

      if (response.data.success) {
        showSnackbar(
          "Tenant created successfully",
          "success"
        );

        setOpenDialog(false);

        setFormData(initialFormData);

        await fetchTenants();
      }
    } catch (error) {
      console.error("Failed to create tenant:", error);

      showSnackbar(
        "Failed to create tenant",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open dialog
   */
  const handleOpenDialog = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setOpenDialog(true);
  };

  /**
   * Close dialog
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  /**
   * Snackbar
   */
  const showSnackbar = (
    message: string,
    severity: "success" | "error"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const columns = useMemo<GridColDef<TenantResponse>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 80,
      },
      {
        field: "employeeCode",
        headerName: "Employee Code",
        width: 150,
      },
      {
        field: "tenantName",
        headerName: "Tenant Name",
        width: 220,
      },
      {
        field: "contactPerson",
        headerName: "Contact Person",
        width: 180,
      },
      {
        field: "email",
        headerName: "Email",
        width: 250,
      },
      {
        field: "mobile",
        headerName: "Mobile",
        width: 150,
      },
      {
        field: "country",
        headerName: "Country",
        width: 130,
      },
      {
        field: "state",
        headerName: "State",
        width: 130,
      },
      {
        field: "city",
        headerName: "City",
        width: 130,
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={
              params.value === "ACTIVE"
                ? "success"
                : "default"
            }
            size="small"
          />
        ),
      },
      {
        field: "createdDate",
        headerName: "Created Date",
        width: 180,
        valueFormatter: (value) =>
          value
            ? new Date(value).toLocaleString()
            : "",
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={600}
          >
            Tenant Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage all registered tenants
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchTenants}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Tenant
          </Button>
        </Box>
      </Box>

      {/* Data Table */}
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={tenants}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            minHeight: 500,
          }}
        />
      </Paper>

      {/* Add Tenant Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Add New Tenant

            <IconButton
              onClick={handleCloseDialog}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <DialogContent dividers>
            <Grid
              container
              spacing={2}
            >
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Employee Code"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  error={Boolean(formErrors.employeeCode)}
                  helperText={formErrors.employeeCode}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Tenant Name"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleChange}
                  error={Boolean(formErrors.tenantName)}
                  helperText={formErrors.tenantName}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  error={Boolean(formErrors.contactPerson)}
                  helperText={formErrors.contactPerson}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={Boolean(formErrors.mobile)}
                  helperText={formErrors.mobile}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  error={Boolean(formErrors.country)}
                  helperText={formErrors.country}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={Boolean(formErrors.state)}
                  helperText={formErrors.state}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={Boolean(formErrors.city)}
                  helperText={formErrors.city}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Tenant"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tenant;