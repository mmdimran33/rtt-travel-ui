import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/reduxHooks';
import { 
  fetchUsers, 
  deleteUser, 
  clearError, 
  clearSuccess 
} from './userSlice';
import { UserForm } from './UserForm';
import { UserDetails } from './UserDetails';
import { Status, UserType } from './user';

export const User: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error, success } = useAppSelector((state) => state.users);
  
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
    if (success) {
      setSnackbar({ open: true, message: 'Operation completed successfully!', severity: 'success' });
      dispatch(clearSuccess());
    }
  }, [error, success, dispatch]);

  const handleCreateUser = () => {
    setFormMode('create');
    setSelectedUserId(null);
    setOpenForm(true);
  };

  const handleEditUser = (id: number) => {
    setFormMode('edit');
    setSelectedUserId(id);
    setOpenForm(true);
  };

  const handleViewUser = (id: number) => {
    setSelectedUserId(id);
    setOpenDetails(true);
  };

  const handleDeleteUser = (id: number) => {
    setSelectedUserId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      await dispatch(deleteUser(selectedUserId));
      setOpenDeleteDialog(false);
      setSelectedUserId(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Create User
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Employee Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.employeeCode}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.userType}
                        color={getUserTypeColor(user.userType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleViewUser(user.id)}
                        color="info"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user.id)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Form Dialog */}
      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        mode={formMode}
        userId={selectedUserId}
      />

      {/* User Details Dialog */}
      <UserDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        userId={selectedUserId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};