import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Paper,
  CircularProgress,
  Backdrop,
} from '@mui/material';

import UserForm from './UserForm';
import UsersTable from './UsersTable';
import { fetchUsersAPI, addUserAPI, updateUserAPI, deleteUserAPI } from '../services/api';
import { splitFullName, combineName, showSuccessMessage } from '../utils/utils';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetchUsersAPI();
      const usersWithDepartment = response.data.map((user) => ({
        ...user,
        department: user.company?.name || 'N/A',
      }));
      setUsers(usersWithDepartment);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  const initialValues = editingUser
    ? {
        ...splitFullName(editingUser.name),
        email: editingUser.email,
        department: editingUser.department,
      }
    : {
        firstName: '',
        lastName: '',
        email: '',
        department: '',
      };

  const addUser = async (values) => {
    try {
      const fullName = combineName(values.firstName, values.lastName);
      const user = {
        name: fullName,
        email: values.email,
        company: {
          name: values.department,
        },
      };
      await addUserAPI(user);

      const newUser = {
        id: users.length + 1,
        name: fullName,
        email: values.email,
        department: values.department,
      };
      setUsers([...users, newUser]);
      showSuccessMessage(setSuccessMessage, setOpenSnackbar, 'User added successfully!');
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
  };

  const updateUser = async (values) => {
    try {
      const fullName = combineName(values.firstName, values.lastName);
      const user = {
        name: fullName,
        email: values.email,
        company: {
          name: values.department,
        },
      };
      await updateUserAPI(editingUser.id, user);
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: fullName, email: values.email, department: values.department }
            : u,
        ),
      );
      showSuccessMessage(setSuccessMessage, setOpenSnackbar, 'User updated successfully!');
      cancelEdit();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setError('');
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteDialog({ open: true, userId: id });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  const deleteUser = async () => {
    const id = deleteDialog.userId;
    try {
      await deleteUserAPI(id);
      setUsers(users.filter((user) => user.id !== id));
      showSuccessMessage(setSuccessMessage, setOpenSnackbar, 'User deleted successfully!');
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setError('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        open={true}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading users...
        </Typography>
      </Backdrop>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <UserForm
          initialValues={initialValues}
          onSubmit={editingUser ? updateUser : addUser}
          editingUser={editingUser}
          cancelEdit={cancelEdit}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <UsersTable
        users={users}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        editUser={editUser}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;