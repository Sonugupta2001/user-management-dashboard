import React from 'react';

import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserForm = ({ initialValues, onSubmit, editingUser, cancelEdit }) => {
  // Formik Validation Schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string(),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    department: Yup.string().required('Department is required'),
  });

  // Formik Hook
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {editingUser ? 'Edit User' : 'Add New User'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstName"
            fullWidth
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Last Name"
            variant="outlined"
            name="lastName"
            fullWidth
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl
            variant="outlined"
            fullWidth
            required
            error={formik.touched.department && Boolean(formik.errors.department)}
          >
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Department"
            >
              {/* Provide predefined departments */}
              <MenuItem value="Romaguera-Crona">Romaguera-Crona</MenuItem>
              <MenuItem value="Deckow-Crist">Deckow-Crist</MenuItem>
              <MenuItem value="Romaguera-Jacobson">Romaguera-Jacobson</MenuItem>
              <MenuItem value="Robel-Corkery">Robel-Corkery</MenuItem>
              <MenuItem value="Keebler LLC">Keebler LLC</MenuItem>
              <MenuItem value="Considine-Lockman">Considine-Lockman</MenuItem>
              <MenuItem value="Johns Group">Johns Group</MenuItem>
              <MenuItem value="Abernathy Group">Abernathy Group</MenuItem>
              <MenuItem value="Yost and Sons">Yost and Sons</MenuItem>
              <MenuItem value="Hoeger LLC">Hoeger LLC</MenuItem>
            </Select>
            {formik.touched.department && formik.errors.department && (
              <Typography color="error" variant="caption">
                {formik.errors.department}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <div style={{ marginTop: '16px' }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
          {editingUser ? 'Update User' : 'Add User'}
        </Button>
        {editingUser && (
          <Button variant="outlined" color="secondary" onClick={cancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default UserForm;