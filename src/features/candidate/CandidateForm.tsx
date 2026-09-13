import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { CompanyResponse } from "../company/company";
import type {
  CandidateResponse,
  CreateCandidateRequest,
  Gender,
} from "./candidate";

interface CandidateFormProps {
  candidate: CandidateResponse | null;
  companies: CompanyResponse[];
  error?: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCandidateRequest) => void;
  open: boolean;
}

const emptyForm: CreateCandidateRequest = {
  companyId: 0,
  firstName: "",
  lastName: "",
  gender: "MALE",
  dateOfBirth: "",
  passportNumber: "",
  passportExpiryDate: "",
  nationality: "",
  email: "",
  mobile: "",
  address: "",
};

const CandidateForm = ({
  candidate,
  companies,
  error,
  loading,
  onClose,
  onSubmit,
  open,
}: CandidateFormProps) => {
  const [formData, setFormData] = useState<CreateCandidateRequest>(emptyForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CreateCandidateRequest, string>>
  >({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(
      candidate
        ? {
            companyId: candidate.companyId,
            firstName: candidate.firstName,
            lastName: candidate.lastName ?? "",
            gender: candidate.gender,
            dateOfBirth: candidate.dateOfBirth,
            passportNumber: candidate.passportNumber,
            passportExpiryDate: candidate.passportExpiryDate,
            nationality: candidate.nationality,
            email: candidate.email,
            mobile: candidate.mobile,
            address: candidate.address ?? "",
          }
        : emptyForm
    );
    setFormErrors({});
  }, [candidate, open]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleCompanyChange = (companyId: number) => {
    setFormData((current) => ({ ...current, companyId }));
    setFormErrors((current) => ({ ...current, companyId: "" }));
  };

  const handleGenderChange = (gender: Gender) => {
    setFormData((current) => ({ ...current, gender }));
  };

  const validate = () => {
    const errors: Partial<Record<keyof CreateCandidateRequest, string>> = {};
    const requiredFields = [
      "firstName",
      "dateOfBirth",
      "passportNumber",
      "passportExpiryDate",
      "nationality",
      "email",
      "mobile",
    ] as const;

    if (!formData.companyId) {
      errors.companyId = "Company is required";
    }
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errors[field] = "This field is required";
      }
    });
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (
      formData.passportExpiryDate &&
      formData.passportExpiryDate <= new Date().toISOString().slice(0, 10)
    ) {
      errors.passportExpiryDate = "Passport expiry date must be in the future";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        lastName: formData.lastName?.trim() || undefined,
        address: formData.address?.trim() || undefined,
      });
    }
  };

  const isEdit = Boolean(candidate);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? "Update Candidate" : "Add Candidate"}</DialogTitle>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required error={Boolean(formErrors.companyId)}>
                <InputLabel id="candidate-company-label">Company</InputLabel>
                <Select
                  labelId="candidate-company-label"
                  label="Company"
                  value={formData.companyId || ""}
                  onChange={(event) => handleCompanyChange(Number(event.target.value))}
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.companyId && <Alert severity="error" sx={{ mt: 1 }}>{formErrors.companyId}</Alert>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={Boolean(formErrors.firstName)} helperText={formErrors.firstName} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="candidate-gender-label">Gender</InputLabel>
                <Select labelId="candidate-gender-label" label="Gender" value={formData.gender} onChange={(event) => handleGenderChange(event.target.value as Gender)}>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} error={Boolean(formErrors.dateOfBirth)} helperText={formErrors.dateOfBirth} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Passport Number" name="passportNumber" value={formData.passportNumber} onChange={handleChange} error={Boolean(formErrors.passportNumber)} helperText={formErrors.passportNumber} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Passport Expiry Date" name="passportExpiryDate" type="date" value={formData.passportExpiryDate} onChange={handleChange} error={Boolean(formErrors.passportExpiryDate)} helperText={formErrors.passportExpiryDate} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} error={Boolean(formErrors.nationality)} helperText={formErrors.nationality} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={Boolean(formErrors.email)} helperText={formErrors.email} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} error={Boolean(formErrors.mobile)} helperText={formErrors.mobile} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={3} label="Address" name="address" value={formData.address} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Candidate" : "Add Candidate"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CandidateForm;
