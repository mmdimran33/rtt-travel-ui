import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/reduxHooks';
import { createUser, updateUser, fetchUserById, clearError } from './userSlice';
import { UserType, type CreateUserRequest,  type UpdateUserRequest } from './user';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  userId?: number | null;
}

const initialCreateState: CreateUserRequest = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  password: '',
  userType: UserType.EMPLOYEE,
};

const initialUpdateState: UpdateUserRequest = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
};

export const UserForm: React.FC<UserFormProps> = ({ open, onClose, mode, userId }) => {
  const dispatch = useAppDispatch();
  const { selectedUser, loading, error } = useAppSelector((state) => state.users);
  
  const [formData, setFormData] = useState<CreateUserRequest | UpdateUserRequest>(
    mode === 'create' ? initialCreateState : initialUpdateState
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && mode === 'edit' && userId) {
      dispatch(fetchUserById(userId));
    }
  }, [open, mode, userId, dispatch]);

  useEffect(() => {
    if (mode === 'edit' && selectedUser) {
      setFormData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        mobile: selectedUser.mobile,
      });
    }
    if (mode === 'create') {
      setFormData(initialCreateState);
    }
  }, [selectedUser, mode]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      errors.mobile = 'Invalid mobile number';
    }
    if (mode === 'create') {
      const createData = formData as CreateUserRequest;
      if (!createData.password?.trim()) {
        errors.password = 'Password is required';
      }
      if (!createData.employeeCode?.trim()) {
        errors.employeeCode = 'Employee code is required';
      }
      if (!createData.userType) {
        errors.userType = 'User type is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (mode === 'create') {
      await dispatch(createUser(formData as CreateUserRequest));
    } else if (mode === 'edit' && userId) {
      const { firstName, lastName, email, mobile } = formData as UpdateUserRequest;
      await dispatch(updateUser({ id: userId, data: { firstName, lastName, email, mobile } }));
    }
    
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create New User' : 'Edit User'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {mode === 'create' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Code"
                  value={(formData as CreateUserRequest).employeeCode || ''}
                  onChange={(e) => handleChange('employeeCode', e.target.value)}
                  error={!!formErrors.employeeCode}
                  helperText={formErrors.employeeCode}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.userType}>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    value={(formData as CreateUserRequest).userType || ''}
                    onChange={(e) => handleChange('userType', e.target.value)}
                    label="User Type"
                  >
                    <MenuItem value={UserType.SUPER_ADMIN}>Super Admin</MenuItem>
                    <MenuItem value={UserType.TENANT_ADMIN}>Tenant Admin</MenuItem>
                    <MenuItem value={UserType.TENANT_USER}>Tenant User</MenuItem>
                    <MenuItem value={UserType.VENDOR}>Vendor</MenuItem>
                  </Select>
                  {formErrors.userType && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {formErrors.userType}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={formData.mobile || ''}
              onChange={(e) => handleChange('mobile', e.target.value)}
              error={!!formErrors.mobile}
              helperText={formErrors.mobile}
              placeholder="10-digit mobile number"
            />
          </Grid>
          {mode === 'create' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={(formData as CreateUserRequest).password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};