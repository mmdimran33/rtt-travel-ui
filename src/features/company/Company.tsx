import { useEffect, useMemo, useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "../../app/store";

import {
  createCompany,
  deleteCompany,
  fetchAllCompanies,
  updateCompany,
} from "./companySlice";

import type {
  CompanyResponse,
  CreateCompanyRequest,
} from "./company";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
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

  const {
    companies,
    loading,
  } = useSelector(
    (state: RootState) =>
      state.company ?? {
        companies: [],
        loading: false,
        error: null,
      }
  );


  // ==========================
  // DIALOG
  // ==========================

  const [openDialog, setOpenDialog] =
    useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);


  // ==========================
  // EDIT MODE
  // ==========================

  const [editMode, setEditMode] =
    useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState<CompanyResponse | null>(null);


  // ==========================
  // FORM
  // ==========================

  const [formData, setFormData] =
    useState<CompanyFormData>(
      initialFormData
    );

  const [formErrors, setFormErrors] =
    useState<
      Partial<
        Record<
          keyof CompanyFormData,
          string
        >
      >
    >({});


  // ==========================
  // SNACKBAR
  // ==========================

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity:
        "success" as
          | "success"
          | "error",
    });


  // ==========================
  // LOAD DATA
  // ==========================

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);


  // ==========================
  // OPEN ADD DIALOG
  // ==========================

  const handleAddCompany = () => {

    setEditMode(false);

    setSelectedCompany(null);

    setFormData(initialFormData);

    setFormErrors({});

    setOpenDialog(true);
  };


  // ==========================
  // OPEN EDIT DIALOG
  // ==========================

  const handleEditCompany = (
    company: CompanyResponse
  ) => {

    setEditMode(true);

    setSelectedCompany(company);

    setFormData({
      companyCode:
        company.companyCode ?? "",

      companyName:
        company.companyName ?? "",

      contactPerson:
        company.contactPerson ?? "",

      email:
        company.email ?? "",

      mobile:
        company.mobile ?? "",

      country:
        company.country ?? "",

      state:
        company.state ?? "",

      city:
        company.city ?? "",

      address:
        company.address ?? "",
    });

    setFormErrors({});

    setOpenDialog(true);
  };


  // ==========================
  // CLOSE FORM DIALOG
  // ==========================

  const handleCloseDialog = () => {

    if (loading) {
      return;
    }

    setOpenDialog(false);

    setEditMode(false);

    setSelectedCompany(null);

    setFormData(initialFormData);

    setFormErrors({});
  };


  // ==========================
  // HANDLE FORM CHANGE
  // ==========================

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };


  // ==========================
  // VALIDATION
  // ==========================

  const validateForm = (): boolean => {

    const errors: Partial<
      Record<
        keyof CompanyFormData,
        string
      >
    > = {};


    // Company Code
    if (!formData.companyCode.trim()) {

      errors.companyCode =
        "Company code is required";

    } else if (
      formData.companyCode.length > 20
    ) {

      errors.companyCode =
        "Company code must not exceed 20 characters";
    }


    // Company Name
    if (!formData.companyName.trim()) {

      errors.companyName =
        "Company name is required";

    } else if (
      formData.companyName.length > 150
    ) {

      errors.companyName =
        "Company name must not exceed 150 characters";
    }


    // Contact Person
    if (!formData.contactPerson.trim()) {

      errors.contactPerson =
        "Contact person is required";

    } else if (
      formData.contactPerson.length > 100
    ) {

      errors.contactPerson =
        "Contact person must not exceed 100 characters";
    }


    // Email
    if (!formData.email.trim()) {

      errors.email =
        "Email is required";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {

      errors.email =
        "Invalid email format";

    } else if (
      formData.email.length > 150
    ) {

      errors.email =
        "Email must not exceed 150 characters";
    }


    // Mobile
    if (!formData.mobile.trim()) {

      errors.mobile =
        "Mobile number is required";

    } else if (
      !/^[0-9]{10,15}$/.test(
        formData.mobile
      )
    ) {

      errors.mobile =
        "Mobile number must contain between 10 and 15 digits";
    }


    // Country
    if (
      formData.country.length > 100
    ) {

      errors.country =
        "Country must not exceed 100 characters";
    }


    // State
    if (
      formData.state.length > 100
    ) {

      errors.state =
        "State must not exceed 100 characters";
    }


    // City
    if (
      formData.city.length > 100
    ) {

      errors.city =
        "City must not exceed 100 characters";
    }


    // Address
    if (
      formData.address.length > 500
    ) {

      errors.address =
        "Address must not exceed 500 characters";
    }


    setFormErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };


  // ==========================
  // CREATE / UPDATE
  // ==========================

  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault();

    if (!validateForm()) {
      return;
    }


    try {

      if (
        editMode &&
        selectedCompany
      ) {

        await dispatch(
          updateCompany({
            companyId:
              selectedCompany.id,

            companyData: formData,
          })
        ).unwrap();


        setSnackbar({
          open: true,
          message:
            "Company updated successfully",
          severity: "success",
        });

      } else {

        await dispatch(
          createCompany(formData)
        ).unwrap();


        setSnackbar({
          open: true,
          message:
            "Company created successfully",
          severity: "success",
        });
      }


      handleCloseDialog();

    } catch (error: any) {

      setSnackbar({
        open: true,

        message:
          error ||
          (
            editMode
              ? "Failed to update company"
              : "Failed to create company"
          ),

        severity: "error",
      });
    }
  };


  // ==========================
  // DELETE
  // ==========================

  const handleDeleteClick = (
    company: CompanyResponse
  ) => {

    setSelectedCompany(company);

    setOpenDeleteDialog(true);
  };


  const handleDeleteConfirm =
    async () => {

      if (!selectedCompany) {
        return;
      }

      try {

        await dispatch(
          deleteCompany(
            selectedCompany.id
          )
        ).unwrap();


        setSnackbar({
          open: true,
          message:
            "Company deleted successfully",
          severity: "success",
        });


        setOpenDeleteDialog(false);

        setSelectedCompany(null);

      } catch (error: any) {

        setSnackbar({
          open: true,

          message:
            error ||
            "Failed to delete company",

          severity: "error",
        });
      }
    };


  // ==========================
  // GRID COLUMNS
  // ==========================

  const columns =
    useMemo<GridColDef<CompanyResponse>[]>(
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
          width: 230,
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
          width: 120,

          renderCell: (
            params: GridRenderCellParams
          ) => (

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

          valueFormatter: (
            value
          ) =>
            value
              ? new Date(
                  value
                ).toLocaleString()
              : "",
        },

        {
          field: "actions",
          headerName: "Actions",
          width: 130,
          sortable: false,
          filterable: false,

          renderCell: (
            params: GridRenderCellParams<CompanyResponse>
          ) => (

            <Box
              sx={{
                display: "flex",
                gap: 0.5,
              }}
            >

              <Tooltip title="Edit Company">

                <IconButton
                  size="small"
                  color="primary"
                  onClick={() =>
                    handleEditCompany(
                      params.row
                    )
                  }
                >

                  <EditIcon fontSize="small" />

                </IconButton>

              </Tooltip>


              <Tooltip title="Delete Company">

                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    handleDeleteClick(
                      params.row
                    )
                  }
                >

                  <DeleteIcon fontSize="small" />

                </IconButton>

              </Tooltip>

            </Box>
          ),
        },

      ],
      []
    );


  // ==========================
  // UI
  // ==========================

  return (

    <Box sx={{ p: 3 }}>

      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >

        <Box>

          <Typography
            variant="h5"
            fontWeight={600}
          >
            Company Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage all registered companies
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
              color="primary"
              onClick={() =>
                dispatch(
                  fetchAllCompanies()
                )
              }
              disabled={loading}
            >

              <RefreshIcon />

            </IconButton>

          </Tooltip>


          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={
              handleAddCompany
            }
          >
            Add Company
          </Button>

        </Box>

      </Box>


      {/* DATA GRID */}

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >

        <DataGrid
          rows={companies}
          columns={columns}
          loading={loading}

          getRowId={(row) =>
            row.id
          }

          pageSizeOptions={[
            5,
            10,
            25,
            50,
          ]}

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
            minHeight: 550,
          }}
        />

      </Paper>


      {/* ============================= */}
      {/* ADD / EDIT DIALOG */}
      {/* ============================= */}

      <Dialog
        open={openDialog}
        onClose={
          handleCloseDialog
        }
        fullWidth
        maxWidth="md"
      >

        <DialogTitle>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <Typography
              variant="h6"
              fontWeight={600}
            >
              {editMode
                ? "Edit Company"
                : "Add New Company"}
            </Typography>


            <IconButton
              onClick={
                handleCloseDialog
              }
            >
              <CloseIcon />
            </IconButton>

          </Box>

        </DialogTitle>


        <Box
          component="form"
          onSubmit={
            handleSubmit
          }
        >

          <DialogContent dividers>

            <Grid
              container
              spacing={2}
            >

              {/* COMPANY CODE */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth
                  required

                  label="Company Code"

                  name="companyCode"

                  value={
                    formData.companyCode
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.companyCode
                    )
                  }

                  helperText={
                    formErrors.companyCode
                  }

                  inputProps={{
                    maxLength: 20,
                  }}
                />

              </Grid>


              {/* COMPANY NAME */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth
                  required

                  label="Company Name"

                  name="companyName"

                  value={
                    formData.companyName
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.companyName
                    )
                  }

                  helperText={
                    formErrors.companyName
                  }

                  inputProps={{
                    maxLength: 150,
                  }}
                />

              </Grid>


              {/* CONTACT PERSON */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth
                  required

                  label="Contact Person"

                  name="contactPerson"

                  value={
                    formData.contactPerson
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.contactPerson
                    )
                  }

                  helperText={
                    formErrors.contactPerson
                  }

                  inputProps={{
                    maxLength: 100,
                  }}
                />

              </Grid>


              {/* EMAIL */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth
                  required

                  type="email"

                  label="Email"

                  name="email"

                  value={
                    formData.email
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.email
                    )
                  }

                  helperText={
                    formErrors.email
                  }

                  inputProps={{
                    maxLength: 150,
                  }}
                />

              </Grid>


              {/* MOBILE */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth
                  required

                  label="Mobile Number"

                  name="mobile"

                  value={
                    formData.mobile
                  }

                  onChange={(event) => {

                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setFormData(
                      (previous) => ({
                        ...previous,
                        mobile: value,
                      })
                    );

                    setFormErrors(
                      (previous) => ({
                        ...previous,
                        mobile: "",
                      })
                    );

                  }}

                  error={
                    Boolean(
                      formErrors.mobile
                    )
                  }

                  helperText={
                    formErrors.mobile ||
                    "10 to 15 digits"
                  }

                  inputProps={{
                    maxLength: 15,
                    inputMode: "numeric",
                  }}
                />

              </Grid>


              {/* COUNTRY */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth

                  label="Country"

                  name="country"

                  value={
                    formData.country
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.country
                    )
                  }

                  helperText={
                    formErrors.country
                  }

                  inputProps={{
                    maxLength: 100,
                  }}
                />

              </Grid>


              {/* STATE */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth

                  label="State"

                  name="state"

                  value={
                    formData.state
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.state
                    )
                  }

                  helperText={
                    formErrors.state
                  }

                  inputProps={{
                    maxLength: 100,
                  }}
                />

              </Grid>


              {/* CITY */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >

                <TextField
                  fullWidth

                  label="City"

                  name="city"

                  value={
                    formData.city
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.city
                    )
                  }

                  helperText={
                    formErrors.city
                  }

                  inputProps={{
                    maxLength: 100,
                  }}
                />

              </Grid>


              {/* ADDRESS */}

              <Grid
                size={{ xs: 12 }}
              >

                <TextField
                  fullWidth

                  multiline

                  rows={3}

                  label="Address"

                  name="address"

                  value={
                    formData.address
                  }

                  onChange={
                    handleChange
                  }

                  error={
                    Boolean(
                      formErrors.address
                    )
                  }

                  helperText={
                    formErrors.address
                  }

                  inputProps={{
                    maxLength: 500,
                  }}
                />

              </Grid>

            </Grid>

          </DialogContent>


          <DialogActions
            sx={{
              px: 3,
              py: 2,
            }}
          >

            <Button
              onClick={
                handleCloseDialog
              }

              color="inherit"

              disabled={loading}
            >
              Cancel
            </Button>


            <Button
              type="submit"
              variant="contained"

              disabled={loading}

              startIcon={
                editMode
                  ? <EditIcon />
                  : <AddIcon />
              }
            >

              {loading
                ? "Saving..."
                : editMode
                  ? "Update Company"
                  : "Save Company"}

            </Button>

          </DialogActions>

        </Box>

      </Dialog>


      {/* ============================= */}
      {/* DELETE CONFIRMATION */}
      {/* ============================= */}

      <Dialog
        open={
          openDeleteDialog
        }

        onClose={() => {

          if (!loading) {
            setOpenDeleteDialog(
              false
            );
          }

        }}
      >

        <DialogTitle>
          Delete Company
        </DialogTitle>


        <DialogContent>

          <DialogContentText>

            Are you sure you want to delete{" "}

            <strong>
              {
                selectedCompany
                  ?.companyName
              }
            </strong>

            ?

            <br />

            This action cannot be undone.

          </DialogContentText>

        </DialogContent>


        <DialogActions>

          <Button
            color="inherit"

            onClick={() =>
              setOpenDeleteDialog(
                false
              )
            }

            disabled={loading}
          >
            Cancel
          </Button>


          <Button
            color="error"
            variant="contained"

            startIcon={
              <DeleteIcon />
            }

            onClick={
              handleDeleteConfirm
            }

            disabled={loading}
          >

            {loading
              ? "Deleting..."
              : "Delete"}

          </Button>

        </DialogActions>

      </Dialog>


      {/* ============================= */}
      {/* SNACKBAR */}
      {/* ============================= */}

      <Snackbar
        open={
          snackbar.open
        }

        autoHideDuration={4000}

        onClose={() =>
          setSnackbar(
            (previous) => ({
              ...previous,
              open: false,
            })
          )
        }

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >

        <Alert
          severity={
            snackbar.severity
          }

          variant="filled"

          onClose={() =>
            setSnackbar(
              (previous) => ({
                ...previous,
                open: false,
              })
            )
          }
        >

          {
            snackbar.message
          }

        </Alert>

      </Snackbar>

    </Box>
  );
};

export default Company;