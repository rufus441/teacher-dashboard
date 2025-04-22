import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container
} from '@mui/material';
import { School, Person } from '@mui/icons-material';

const UserTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Selecciona tu tipo de usuario
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Person />}
              onClick={() => navigate('/login/teacher')}
              size="large"
              fullWidth
            >
              Soy Profesor
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<School />}
              onClick={() => navigate('/login/student')}
              size="large"
              fullWidth
            >
              Soy Estudiante
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserTypeSelection; 