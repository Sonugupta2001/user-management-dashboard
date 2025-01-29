import React, { useEffect, useState } from "react";
import axios from "axios";

// MUI Components
import {
  Container,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";


import { Edit, Delete } from "@mui/icons-material";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Add New User
  const addUser = async () => {
    if (!newUser.firstName || !newUser.email) {
      setError("First Name and Email are required");
      return;
    }

    try {
      const fullName = `${newUser.firstName} ${newUser.lastName}`.trim();
      const response = await axios.post(API_URL, {
        name: fullName,
        email: newUser.email,
      });
      setUsers([...users, { ...response.data, id: users.length + 1 }]);
      setNewUser({ firstName: "", lastName: "", email: "" });
      setSuccessMessage("User added successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setError("Failed to add user");
    }
  };

  // Initiate Edit User
  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ")[1] || "",
      email: user.email,
    });
  };

  // Update Existing User
  const updateUser = async () => {
    if (!newUser.firstName || !newUser.email) {
      setError("First Name and Email are required");
      return;
    }

    try {
      const fullName = `${newUser.firstName} ${newUser.lastName}`.trim();
      await axios.put(`${API_URL}/${editingUser.id}`, {
        name: fullName,
        email: newUser.email,
      });
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? { ...user, name: fullName, email: newUser.email }
            : user
        )
      );
      setEditingUser(null);
      setNewUser({ firstName: "", lastName: "", email: "" });
      setSuccessMessage("User updated successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingUser(null);
    setNewUser({ firstName: "", lastName: "", email: "" });
    setError("");
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
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setSuccessMessage("User deleted successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Handle Snackbar Close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError("");
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
        <Typography variant="h6" gutterBottom>
          {editingUser ? "Edit User" : "Add New User"}
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editingUser ? updateUser() : addUser();
          }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <TextField
              label="First Name"
              variant="outlined"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <div style={{ marginTop: "16px" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
            >
              {editingUser ? "Update User" : "Add User"}
            </Button>
            {editingUser && (
              <Button variant="outlined" color="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Paper>

      {/* Display Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length ? (
              users.map((user) => {
                const [firstName, ...lastNameParts] = user.name.split(" ");
                const lastName = lastNameParts.join(" ");
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{firstName}</TableCell>
                    <TableCell>{lastName || "-"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => editUser(user)}
                        aria-label="edit"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(user.id)}
                        aria-label="delete"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
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

/* ---------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, { ...response.data, id: users.length + 1 }]);
      setNewUser({ firstName: "", lastName: "", email: "" });
    } catch (err) {
      setError("Failed to add user");
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({ firstName: user.name.split(" ")[0], lastName: user.name.split(" ")[1] || "", email: user.email });
  };

  const updateUser = async () => {
    try {
      await axios.put(`${API_URL}/${editingUser.id}`, newUser);
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, name: `${newUser.firstName} ${newUser.lastName}`, email: newUser.email } : user));
      cancelEdit();
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setNewUser({ firstName: "", lastName: "", email: "" });
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mb-4">
        <input type="text" placeholder="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} className="border p-2 mr-2" />
        <input type="text" placeholder="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} className="border p-2 mr-2" />
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border p-2 mr-2" />
        {editingUser ? (
          <>
            <button onClick={updateUser} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Update</button>
            <button onClick={cancelEdit} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
          </>
        ) : (
          <button onClick={addUser} className="bg-green-500 text-white px-2 py-1 rounded">Add</button>
        )}
      </div>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border">
              <td className="p-2 border">{user.id}</td>
              <td className="p-2 border">{user.name.split(" ")[0]}</td>
              <td className="p-2 border">{user.name.split(" ")[1] || ""}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">
                <button onClick={() => editUser(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

--------------------------------------------------------------------------------- */