import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Tooltip,
  Chip,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface Attendance {
  id: number;
  studentId: number;
  studentName: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  subject: string;
  notes?: string;
}

const mockAttendances: Attendance[] = [
  { 
    id: 1, 
    studentId: 1,
    studentName: 'Juan Pérez',
    date: new Date('2024-04-21'),
    status: 'present',
    subject: 'Matemáticas',
    notes: 'Participó activamente en clase'
  },
  { 
    id: 2, 
    studentId: 2,
    studentName: 'María García',
    date: new Date('2024-04-21'),
    status: 'late',
    subject: 'Matemáticas',
    notes: 'Llegó 15 minutos tarde'
  },
];

const Attendance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [formData, setFormData] = useState<Partial<Attendance>>({});

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (attendance?: Attendance) => {
    if (attendance) {
      setSelectedAttendance(attendance);
      setFormData(attendance);
    } else {
      setSelectedAttendance(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAttendance(null);
    setFormData({});
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los datos
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    // Aquí iría la lógica para eliminar la asistencia
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Ausente';
      case 'late':
        return 'Tarde';
      default:
        return status;
    }
  };

  const filteredAttendances = mockAttendances.filter(attendance =>
    attendance.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendance.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Asistencias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Asistencia
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar asistencias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Materia</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendances
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.studentName}</TableCell>
                  <TableCell>{attendance.subject}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" />
                      {attendance.date.toLocaleDateString()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={attendance.status === 'present' ? <CheckCircleIcon /> : <CancelIcon />}
                      label={getStatusLabel(attendance.status)}
                      color={getStatusColor(attendance.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{attendance.notes}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenDialog(attendance)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDelete(attendance.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAttendances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAttendance ? 'Editar Asistencia' : 'Nueva Asistencia'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Estudiante</InputLabel>
              <Select
                value={formData.studentId || ''}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value as number })}
                label="Estudiante"
              >
                <MenuItem value={1}>Juan Pérez</MenuItem>
                <MenuItem value={2}>María García</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Materia</InputLabel>
              <Select
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                label="Materia"
              >
                <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                <MenuItem value="Ciencias">Ciencias</MenuItem>
                <MenuItem value="Historia">Historia</MenuItem>
                <MenuItem value="Lenguaje">Lenguaje</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha"
                value={formData.date || null}
                onChange={(date) => setFormData({ ...formData, date: date || undefined })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'present' | 'absent' | 'late' })}
                label="Estado"
              >
                <MenuItem value="present">Presente</MenuItem>
                <MenuItem value="absent">Ausente</MenuItem>
                <MenuItem value="late">Tarde</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notas"
              multiline
              rows={4}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Attendance; 