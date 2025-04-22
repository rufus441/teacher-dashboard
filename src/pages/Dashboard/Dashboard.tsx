import React, { useState } from 'react';
import './Dashboard.css';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
  IconButton,
  Badge,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Notifications,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useStudents } from '../../contexts/StudentsContext';
import { useTasks } from '../../contexts/TasksContext';
import { useAttendance } from '../../contexts/AttendanceContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '../../contexts/TasksContext';
import { Student } from '../../contexts/StudentsContext';
import { AttendanceRecord } from '../../contexts/AttendanceContext';

const Dashboard: React.FC = () => {
  const { students, loading: studentsLoading } = useStudents();
  const { tasks, loading: tasksLoading } = useTasks();
  const { records: attendanceRecords, loading: attendanceLoading } = useAttendance();
  const [selectedTab, setSelectedTab] = useState(0);
  const [taskFilter, setTaskFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (studentsLoading || tasksLoading || attendanceLoading) {
    return <Typography>Cargando...</Typography>;
  }

  const completedTasks = tasks.filter((task: Task) => task.status === 'completed').length;
  const pendingTasks = tasks.filter((task: Task) => task.status === 'pending').length;
  const presentStudents = attendanceRecords.filter((record: AttendanceRecord) => record.status === 'present').length;
  const absentStudents = attendanceRecords.filter((record: AttendanceRecord) => record.status === 'absent').length;

  // Calculate statistics
  const today = new Date();
  const todayAttendance = attendanceRecords.filter((record: AttendanceRecord) => 
    format(new Date(record.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );
  const attendanceRate = students.length > 0 
    ? (todayAttendance.length / students.length) * 100 
    : 0;

  const completionRate = tasks.length > 0 
    ? (completedTasks / tasks.length) * 100 
    : 0;

  // Weekly attendance data for chart
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyAttendanceData = weekDays.map(day => {
    const dayAttendance = attendanceRecords.filter((record: AttendanceRecord) => 
      format(new Date(record.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    return {
      day: format(day, 'EEE', { locale: es }),
      attendance: dayAttendance.length
    };
  });

  // Filter tasks based on selected filter
  const filteredTasks = taskFilter === 'all' 
    ? tasks 
    : taskFilter === 'pending' 
      ? tasks.filter((task: Task) => task.status === 'pending') 
      : tasks.filter((task: Task) => task.status === 'completed');

  // Calculate student performance
  const studentPerformance = students.map((student: Student) => {
    const studentAttendance = attendanceRecords.filter((record: AttendanceRecord) => 
      record.studentId === student.id && record.status === 'present'
    );
    
    return {
      id: student.id,
      name: student.name,
      attendanceRate: attendanceRecords.length > 0
        ? (studentAttendance.length / attendanceRecords.length) * 100
        : 0
    };
  });

  const getStudentName = (studentId: string) => {
    const student = students.find((s: Student) => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Box>
          <IconButton color="inherit">
            <Badge badgeContent={pendingTasks} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Calendar" />
        <Tab label="Performance" />
      </Tabs>

      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Estudiantes</Typography>
              <Typography variant="h4">{students.length}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Tareas Completadas</Typography>
              <Typography variant="h4">{completedTasks}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Tareas Pendientes</Typography>
              <Typography variant="h4">{pendingTasks}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Asistencia Hoy</Typography>
              <Typography variant="h4">{presentStudents}/{presentStudents + absentStudents}</Typography>
            </Paper>
          </Grid>

          {/* Weekly Attendance Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Asistencia Semanal
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                {weeklyAttendanceData.map((day) => (
                  <Box key={day.day} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {day.day}
                    </Typography>
                    <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'flex-end' }}>
                      <LinearProgress
                        variant="determinate"
                        value={day.attendance}
                        sx={{
                          width: '100%',
                          height: `${day.attendance}%`,
                          transform: 'rotate(180deg)',
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1976d2',
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {Math.round(day.attendance)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Tasks with Filter */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Tareas Recientes</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filtro</InputLabel>
                  <Select
                    value={taskFilter}
                    label="Filtro"
                    onChange={(e) => setTaskFilter(e.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="pending">Pendientes</MenuItem>
                    <MenuItem value="completed">Completadas</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <List>
                {filteredTasks.slice(0, 5).map((task: Task) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              Fecha límite: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                            </Typography>
                            <Chip
                              label={task.status === 'completed' ? 'Completada' : 'Pendiente'}
                              color={task.status === 'completed' ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Today's Attendance */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Asistencia de Hoy
              </Typography>
              <List>
                {todayAttendance.slice(0, 5).map((record: AttendanceRecord) => (
                  <React.Fragment key={record.id}>
                    <ListItem>
                      <ListItemText
                        primary={getStudentName(record.studentId)}
                        secondary={
                          <Chip
                            label={record.status === 'present' ? 'Presente' : record.status === 'late' ? 'Tarde' : 'Ausente'}
                            color={
                              record.status === 'present'
                                ? 'success'
                                : record.status === 'late'
                                ? 'warning'
                                : 'error'
                            }
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate(newValue);
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                    },
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tareas para {format(selectedDate, 'dd/MM/yyyy')}
              </Typography>
              <List>
                {tasks
                  .filter((task: Task) => format(new Date(task.dueDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                  .map((task: Task) => (
                    <ListItem key={task.id}>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Chip
                            label={task.status === 'completed' ? 'Completada' : 'Pendiente'}
                            color={task.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Rendimiento de Estudiantes
              </Typography>
              <List>
                {studentPerformance.map((student) => (
                  <React.Fragment key={student.id}>
                    <ListItem>
                      <ListItemText
                        primary={student.name}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Tasa de Asistencia
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={student.attendanceRate}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {Math.round(student.attendanceRate)}%
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard; 