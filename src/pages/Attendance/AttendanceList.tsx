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
  TextField,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useStudents } from '../../contexts/StudentsContext';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  notes: string;
}

const AttendanceList: React.FC = () => {
  const { students } = useStudents();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [formData, setFormData] = useState<Omit<Attendance, 'id'>>({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    notes: '',
  });

  const handleOpenDialog = (attendance?: Attendance) => {
    if (attendance) {
      setEditingAttendance(attendance);
      setFormData({
        studentId: attendance.studentId,
        date: attendance.date,
        status: attendance.status,
        notes: attendance.notes,
      });
    } else {
      setEditingAttendance(null);
      setFormData({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAttendance(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAttendance) {
      setAttendances(
        attendances.map((a) =>
          a.id === editingAttendance.id ? { ...a, ...formData, status: formData.status as AttendanceStatus } : a
        )
      );
    } else {
      setAttendances([
        ...attendances,
        { ...formData, id: Date.now().toString(), status: formData.status as AttendanceStatus },
      ]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setAttendances(attendances.filter((a) => a.id !== id));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Attendance
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Attendance
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>
                  {students.find((s) => s.id === attendance.studentId)?.name ||
                    'Unknown Student'}
                </TableCell>
                <TableCell>{attendance.date}</TableCell>
                <TableCell>{attendance.status}</TableCell>
                <TableCell>{attendance.notes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(attendance)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(attendance.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAttendance ? 'Edit Attendance' : 'Add Attendance'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Student</InputLabel>
              <Select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                label="Student"
                required
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as AttendanceStatus,
                  })
                }
                label="Status"
                required
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingAttendance ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AttendanceList; 