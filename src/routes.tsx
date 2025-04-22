import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './theme';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import Tasks from './pages/Tasks/Tasks';
import AttendanceList from './pages/Attendance/AttendanceList';
import TeacherLayout from './components/Layout/TeacherLayout';
import StudentLayout from './components/Layout/StudentLayout';
import Comments from './pages/Comments/Comments';

const PrivateRoute: React.FC<{ children: React.ReactNode; role: 'teacher' | 'student' }> = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute role="teacher">
              <TeacherLayout>
                <Dashboard />
              </TeacherLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <PrivateRoute role="teacher">
              <TeacherLayout>
                <Students />
              </TeacherLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/tasks"
          element={
            <PrivateRoute role="teacher">
              <TeacherLayout>
                <Tasks />
              </TeacherLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <PrivateRoute role="teacher">
              <TeacherLayout>
                <AttendanceList />
              </TeacherLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/comments"
          element={
            <PrivateRoute role="teacher">
              <TeacherLayout>
                <Comments />
              </TeacherLayout>
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute role="student">
              <StudentLayout>
                <Dashboard />
              </StudentLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/tasks"
          element={
            <PrivateRoute role="student">
              <StudentLayout>
                <Tasks />
              </StudentLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <PrivateRoute role="student">
              <StudentLayout>
                <AttendanceList />
              </StudentLayout>
            </PrivateRoute>
          }
        />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
};

export default AppRoutes; 