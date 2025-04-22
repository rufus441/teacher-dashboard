import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTasks } from '../../contexts/TasksContext';
import TaskDialog from './TaskDialog';
import { Task } from '../../contexts/TasksContext';

const Tasks: React.FC = () => {
  const { tasks, loading, deleteTask } = useTasks();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleOpenDialog = () => {
    setSelectedTask(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleEditTask = (taskId: string) => {
    setSelectedTask(taskId);
    setOpenDialog(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <Typography>Cargando tareas...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Task
        </Button>
      </Box>

      <Paper>
        <List>
          {tasks.map((task: Task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" onClick={() => handleEditTask(task.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={task.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Fecha límite: {task.dueDate?.toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={task.status === 'completed' ? 'Completada' : 'Pendiente'}
                      color={task.status === 'completed' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <TaskDialog
        open={openDialog}
        onClose={handleCloseDialog}
        taskId={selectedTask}
      />
    </Box>
  );
};

export default Tasks; 