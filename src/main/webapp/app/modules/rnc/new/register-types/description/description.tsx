import React from 'react';
import './description.css';
import { Card, Divider, Fab, IconButton, TextField } from '@mui/material';
import { Add, DeleteOutlined, EditOutlined, UploadFileOutlined } from '@mui/icons-material';

export const DescriptionRnc = () => {
  return (
    <Card>
      <h3 className="m-3">Descrição</h3>
      <Divider variant="middle" />
      <TextField label="Não conformidade" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} />
      <TextField label="Requisito descumprido" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} />
      <TextField label="Evidência objetiva" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} />
      <div className="mb-3 mt-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton>
          <UploadFileOutlined></UploadFileOutlined>
        </IconButton>
        <IconButton>
          <EditOutlined></EditOutlined>
        </IconButton>
        <IconButton>
          <DeleteOutlined></DeleteOutlined>
        </IconButton>
        <Fab color="primary" aria-label="add" size="medium">
          <Add />
        </Fab>
      </div>
    </Card>
  );
};

export default DescriptionRnc;
