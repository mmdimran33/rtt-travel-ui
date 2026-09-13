import { useEffect, useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { fetchAllCompany } from "../company/company.api";
import type { CompanyResponse } from "../company/company";
import CandidateForm from "./CandidateForm";
import {
  createCandidate,
  fetchCandidates,
  updateCandidate,
} from "./candidateSlice";
import type { CandidateResponse, CreateCandidateRequest } from "./candidate";

const Candidate = () => {
  const dispatch = useAppDispatch();
  const { candidates, loading } = useAppSelector((state) => state.candidate);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResponse | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const loadData = async () => {
    try {
      await dispatch(fetchCandidates()).unwrap();
    } catch {
      setSnackbar({ open: true, message: "Failed to load candidate data", severity: "error" });
    }
  };

  useEffect(() => {
    void dispatch(fetchCandidates()).unwrap().catch(() => {
      setSnackbar({ open: true, message: "Failed to load candidate data", severity: "error" });
    });
  }, [dispatch]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setCompanies(await fetchAllCompany());
      } catch {
        setSnackbar({ open: true, message: "Failed to load companies", severity: "error" });
      }
    };

    void loadCompanies();
  }, []);

  const openAddForm = () => {
    setSelectedCandidate(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = (candidate: CandidateResponse) => {
    setSelectedCandidate(candidate);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (!loading) {
      setFormOpen(false);
    }
  };

  const handleSubmit = async (data: CreateCandidateRequest) => {
    setFormError("");
    try {
      if (selectedCandidate) {
        await dispatch(updateCandidate({ id: selectedCandidate.id, data })).unwrap();
      } else {
        await dispatch(createCandidate(data)).unwrap();
      }
      setFormOpen(false);
      setSnackbar({ open: true, message: `Candidate ${selectedCandidate ? "updated" : "created"} successfully`, severity: "success" });
    } catch {
      setFormError(`Failed to ${selectedCandidate ? "update" : "create"} candidate`);
    }
  };

  const columns: GridColDef<CandidateResponse>[] = [
    { field: "id", headerName: "Candidate Id", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150, valueGetter: (_value, row) => row.lastName ?? "" },
    { field: "companyId", headerName: "Company", width: 170 },
    { field: "passportNumber", headerName: "Passport Number", width: 170 },
    { field: "nationality", headerName: "Nationality", width: 140 },
    { field: "mobile", headerName: "Mobile", width: 150 },
    { field: "status", headerName: "Status", width: 120, renderCell: (params) => <Chip label={params.value} color={params.value === "ACTIVE" ? "success" : "default"} size="small" /> },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Edit candidate">
          <IconButton aria-label={`Edit ${params.row.firstName}`} onClick={() => openEditForm(params.row)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const displayedCandidates = selectedCompanyId
    ? candidates.filter((candidate) => candidate.companyId === Number(selectedCompanyId))
    : candidates;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ alignItems: "center", display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" }, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Candidate Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage candidate details and documents</Typography>
        </Box>
        <Box sx={{ justifySelf: { xs: "stretch", md: "center" } }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="candidate-company-filter-label">Company</InputLabel>
            <Select
              labelId="candidate-company-filter-label"
              label="Company"
              value={selectedCompanyId}
              onChange={(event) => setSelectedCompanyId(event.target.value)}
            >
              <MenuItem value="">All Companies</MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>{company.companyName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 1, justifySelf: { xs: "start", md: "end" } }}>
          <Tooltip title="Refresh">
            <IconButton color="primary" onClick={() => void loadData()} disabled={loading}><RefreshIcon /></IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddForm}>Add Candidate</Button>
        </Box>
      </Box>
      <Paper elevation={2} sx={{ overflow: "hidden", width: "100%" }}>
        <DataGrid
          rows={displayedCandidates}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{ border: 0, minHeight: 500 }}
        />
      </Paper>
      <CandidateForm
        open={formOpen}
        candidate={selectedCandidate}
        companies={companies}
        loading={loading}
        error={formError}
        onClose={closeForm}
        onSubmit={(data) => void handleSubmit(data)}
      />
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Candidate;
