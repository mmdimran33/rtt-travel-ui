import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/reduxHooks';
import { fetchUserById, clearSelectedUser } from './userSlice';
import { Status, UserType } from './user';

interface UserDetailsProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography variant="body1">{value || 'N/A'}</Typography>
  </Box>
);

export const UserDetails: React.FC<UserDetailsProps> = ({ open, onClose, userId }) => {
  const dispatch = useAppDispatch();
  const { selectedUser, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (open && userId) {
      dispatch(fetchUserById(userId));
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [open, userId, dispatch]);

  const getStatusColor = (status: Status) => {
    const colors = {
      [Status.ACTIVE]: 'success',
      [Status.INACTIVE]: 'default',
      [Status.SUSPENDED]: 'error',
    };
    return colors[status] as any;
  };

  const getUserTypeColor = (userType: UserType) => {
    const colors = {
      [UserType.SUPER_ADMIN]: 'error',
      [UserType.ADMIN]: 'warning',
      [UserType.COMPANY_USER]: 'info',
      [UserType.VENDOR_USER]: 'default',
    };
    return colors[userType] as any;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        User Details
        {selectedUser && (
          <Chip
            label={selectedUser.status}
            color={getStatusColor(selectedUser.status)}
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : selectedUser ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailRow label="ID" value={selectedUser.id} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Employee Code" value={selectedUser.employeeCode} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="First Name" value={selectedUser.firstName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Last Name" value={selectedUser.lastName} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Email" value={selectedUser.email} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Mobile" value={selectedUser.mobile} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow
                label="User Type"
                value={
                  <Chip
                    label={selectedUser.userType}
                    color={getUserTypeColor(selectedUser.userType)}
                    size="small"
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow
                label="Created At"
                value={new Date(selectedUser.createdAt).toLocaleString()}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary" align="center">
            No user data available
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};