import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import { useTasks } from '../../contexts/TasksContext';
import { Task } from '../../contexts/TasksContext';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  taskId: string | null;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, taskId }) => {
  const { tasks, addTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.dueDate?.toISOString().split('T')[0] || '');
        setStatus(task.status);
      }
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('pending');
    }
  }, [taskId, tasks]);

  const handleSubmit = async () => {
    const taskData = {
      title,
      description,
      dueDate: new Date(dueDate),
      status
    };

    try {
      if (taskId) {
        await updateTask(taskId, taskData);
      } else {
        await addTask(taskData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{taskId ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fecha Límite"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Estado"
          select
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
        >
          <MenuItem value="pending">Pendiente</MenuItem>
          <MenuItem value="completed">Completada</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {taskId ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog; 