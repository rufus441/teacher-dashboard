import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import { Delete as DeleteIcon, Send as SendIcon } from '@mui/icons-material';
import { useStudents } from '../../contexts/StudentsContext';

interface Comment {
  id: string;
  taskId: string;
  content: string;
  studentName: string;
  date: Date;
}

const mockComments: Comment[] = [
  {
    id: '1',
    taskId: '1',
    content: '¿Podría explicar mejor el ejercicio 3?',
    studentName: 'Juan Pérez',
    date: new Date('2024-04-21'),
  },
  {
    id: '2',
    taskId: '1',
    content: 'Ya entendí, gracias por la explicación.',
    studentName: 'Juan Pérez',
    date: new Date('2024-04-22'),
  },
];

const Comments: React.FC = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const { students } = useStudents();

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        taskId: '1', // Esto debería venir de la tarea seleccionada
        content: newComment,
        studentName: 'Juan Pérez', // Esto debería venir del usuario autenticado
        date: new Date(),
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Comentarios
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tarea: Resolver ejercicios de álgebra
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Enviar
          </Button>
        </Box>
      </Paper>
      <List>
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <Avatar sx={{ mr: 2 }}>{comment.studentName[0]}</Avatar>
              <ListItemText
                primary={comment.studentName}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {comment.date.toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Comments; 