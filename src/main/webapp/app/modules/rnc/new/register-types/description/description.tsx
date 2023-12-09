import React from 'react';
import './description.css';
import { Card, Divider, Fab, IconButton, TextField } from '@mui/material';
import { Add, DeleteOutlined, EditOutlined, UploadFileOutlined } from '@mui/icons-material';

export const DescriptionRnc = () => {
  return (
    <Card>
      <h3 className="m-3">Descrição</h3>
      <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
      <TextField label="Não conformidade" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} />
      <TextField label="Requisito descumprido" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} />
      <TextField label="Evidência objetiva" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} />
      <div className="mb-3 mt-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <UploadFileOutlined></UploadFileOutlined>
        </IconButton>
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <EditOutlined></EditOutlined>
        </IconButton>
        <IconButton sx={{ width: '50px', height: '50px' }}>
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
