import React, { useEffect, useState } from 'react';
import { Container, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Paper } from '@mui/material';

import UserForm from './UserForm';
import UsersTable from './UsersTable';
import { fetchUsersAPI, addUserAPI, updateUserAPI, deleteUserAPI } from '../services/api';
import { splitFullName, combineName, showSuccessMessage } from '../utils/utils';

const UserManagement = () => {
  // State Variables
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch Users on Component Mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users from API and Map company.name to department
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
      setLoading(false);
    }
  };

  // Initial Values for Formik
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

  // Add New User
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
      // Since API doesn't persist, assign a new ID and department manually
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

  // Initiate Edit User
  const editUser = (user) => {
    setEditingUser(user);
  };

  // Update Existing User
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
      // Update user in local state
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

  // Cancel Editing
  const cancelEdit = () => {
    setEditingUser(null);
    setError('');
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (id) => {
    setDeleteDialog({ open: true, userId: id });
  };

  // Close Delete Confirmation Dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  // Delete User
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

  // Handle Snackbar Close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setError('');
  };

  // Handle Page Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows Per Page Change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Loading users...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {/* Form for Adding/Editing Users */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <UserForm
          initialValues={initialValues}
          onSubmit={editingUser ? updateUser : addUser}
          editingUser={editingUser}
          cancelEdit={cancelEdit}
        />
      </Paper>

      {/* Display Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <UsersTable
        users={users}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        editUser={editUser}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
      />

      {/* Success Snackbar */}
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

      {/* Delete Confirmation Dialog */}
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