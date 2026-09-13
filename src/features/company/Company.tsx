import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { createCompany, fetchAllCompanies } from "./companySlice";

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

interface CompanyFormData {
companyCode: string;
companyName: string;
contactPerson: string;
email: string;
mobile: string;
country: string;
state: string;
city: string;
address: string;
}

const initialFormData: CompanyFormData = {
companyCode: "",
companyName: "",
contactPerson: "",
email: "",
mobile: "",
country: "",
state: "",
city: "",
address: "",
};

const Company = () => {
const dispatch = useDispatch<AppDispatch>();

const { companies, loading } = useSelector((state: RootState) =>
state.company ?? { companies: [], loading: false }
);

const [openDialog, setOpenDialog] = useState(false);
const [formData, setFormData] =
useState<CompanyFormData>(initialFormData);

const [formErrors, setFormErrors] = useState<
Partial<Record<keyof CompanyFormData, string>>

> ({});

const [snackbar, setSnackbar] = useState({
open: false,
message: "",
severity: "success" as "success" | "error",
});

useEffect(() => {
  dispatch(fetchAllCompanies());
}, [dispatch]);

const handleChange = (
event: ChangeEvent<HTMLInputElement>
) => {
const { name, value } = event.target;

setFormData((prev) => ({
  ...prev,
  [name]: value,
}));

setFormErrors((prev) => ({
  ...prev,
  [name]: "",
}));

};

const validateForm = (): boolean => {
const errors: Partial<
Record<keyof CompanyFormData, string>
> = {};

 
if (!formData.companyCode.trim()) {
  errors.companyCode = "Company code is required";
}

if (!formData.companyName.trim()) {
  errors.companyName = "Company name is required";
}

if (!formData.contactPerson.trim()) {
  errors.contactPerson = "Contact person is required";
}

if (!formData.email.trim()) {
  errors.email = "Email is required";
}

setFormErrors(errors);
return Object.keys(errors).length === 0;
 

};

const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();

  if (!validateForm()) return;

  try {
    await dispatch(createCompany(formData)).unwrap();

    setSnackbar({
      open: true,
      message: 'Company created successfully',
      severity: 'success',
    });

    setOpenDialog(false);
    setFormData(initialFormData);

    dispatch(fetchAllCompanies());
  } catch (error) {
    setSnackbar({
      open: true,
      message: 'Failed to create company',
      severity: 'error',
    });
  }
};

const columns = useMemo<GridColDef[]>(
() => [
{
field: "companyCode",
headerName: "Company Code",
width: 150,
},
{
field: "companyName",
headerName: "Company Name",
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
width: 220,
},
{
field: "mobile",
headerName: "Mobile",
width: 150,
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
<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
mb: 3,
}}
> <Box> <Typography variant="h5" fontWeight={600}>
Company Management </Typography> <Typography
         variant="body2"
         color="text.secondary"
       >
Manage all registered companies </Typography> </Box>

 
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="Refresh">
        <IconButton
          color="primary"
          onClick={() => dispatch(fetchAllCompanies())}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
      >
        Add Company
      </Button>
    </Box>
  </Box>

  <Paper
    elevation={2}
    sx={{ width: "100%", overflow: "hidden" }}
  >
    <DataGrid
      rows={companies}
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
      sx={{ border: 0, minHeight: 500 }}
    />
  </Paper>

  <Dialog
    open={openDialog}
    onClose={() => setOpenDialog(false)}
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
        Add New Company
        <IconButton
          onClick={() => setOpenDialog(false)}
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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Company Code"
              name="companyCode"
              value={formData.companyCode}
              onChange={handleChange}
              error={Boolean(formErrors.companyCode)}
              helperText={formErrors.companyCode}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              error={Boolean(formErrors.companyName)}
              helperText={formErrors.companyName}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
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
          onClick={() => setOpenDialog(false)}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
        >
          Save Company
        </Button>
      </DialogActions>
    </Box>
  </Dialog>

  <Snackbar
    open={snackbar.open}
    autoHideDuration={4000}
    onClose={() =>
      setSnackbar((prev) => ({
        ...prev,
        open: false,
      }))
    }
  >
    <Alert
      severity={snackbar.severity}
      variant="filled"
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
</Box>

);
};

export default Company;

