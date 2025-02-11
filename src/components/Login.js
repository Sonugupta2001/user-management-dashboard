import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper } from '@mui/material';
import "@fontsource/roboto/400.css";

const Login = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/user-management');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        padding: '20px',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '40px',
          borderRadius: '12px',
          width: '400px',
          textAlign: 'center',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          marginTop: '12%',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: '#333' }}
          >
            User Management App
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: '#666' }}
          >
            Click Enter to proceed to the User Management page
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleEnter}
          sx={{
            backgroundColor: '#4285F4',
            color: '#fff',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#357ae8',
            },
          }}
        >
          Enter
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;