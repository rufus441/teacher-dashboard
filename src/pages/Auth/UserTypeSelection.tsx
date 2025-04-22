import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School, Person } from '@mui/icons-material';

const UserTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Select User Type
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Person />}
            onClick={() => navigate('/login/teacher')}
            sx={{ flex: 1, py: 2 }}
          >
            Teacher
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<School />}
            onClick={() => navigate('/login/student')}
            sx={{ flex: 1, py: 2 }}
          >
            Student
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserTypeSelection; 