import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  userType: 'teacher' | 'student';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institution: string;
  grade?: string;
  subject?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RegisterFormData>({
    userType: 'student',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    grade: '',
    subject: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      // Aquí iría la lógica para guardar los datos del usuario
      navigate('/');
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  const steps = ['Tipo de Usuario', 'Información Personal', 'Información Académica'];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset">
            <RadioGroup
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <FormControlLabel
                value="teacher"
                control={<Radio />}
                label="Soy Profesor"
              />
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Soy Estudiante"
              />
            </RadioGroup>
          </FormControl>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Institución"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </Grid>
            {formData.userType === 'student' ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Grado"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Materia que enseña"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Completa tu Registro
          </Typography>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Completar Registro' : 'Siguiente'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 