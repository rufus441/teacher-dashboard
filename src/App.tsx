import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import { StudentsProvider } from './contexts/StudentsContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TasksProvider>
          <StudentsProvider>
            <AttendanceProvider>
              <AppRoutes />
            </AttendanceProvider>
          </StudentsProvider>
        </TasksProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
