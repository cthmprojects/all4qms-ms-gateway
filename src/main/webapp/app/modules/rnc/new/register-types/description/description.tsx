import React, { useState } from 'react';
import './description.css';
import { Card, Divider, Fab, IconButton, TextField } from '@mui/material';
import { Add, DeleteOutlined, EditOutlined, UploadFileOutlined } from '@mui/icons-material';

export const DescriptionRnc = ({ handleDescricao }) => {
  const [descriptions, setDescriptions] = useState([]);
  const [naoConformidade, setNaoConformidade] = useState('');
  const [requisitoDescumprido, setRequisitoDescumprido] = useState('');
  const [evidenciaObjetiva, setEvidenciaObjetiva] = useState('');

  const handleDesc = value => {
    setNaoConformidade(value);
    handleDescricao(value);
  };

  const addDescription = () => {
    if (!naoConformidade || !requisitoDescumprido || !evidenciaObjetiva) return;

    setDescriptions([...descriptions, { naoConformidade, requisitoDescumprido, evidenciaObjetiva }]);
    setNaoConformidade('');
    setRequisitoDescumprido('');
    setEvidenciaObjetiva('');
  };

  const selectFiles = () => {
    // Logic to select files goes here
    // You can use the File API or a file input element to handle file selection
    // For example:
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.addEventListener('change', event => {
      const fileInput = event.target as HTMLInputElement;
      const selectedFiles = fileInput.files;
      // Do something with the selected files
    });
    fileInput.click();
  };

  const renderDescriptions = () => {
    return descriptions.map((description, index) => {
      return (
        <div key={index} className="mt-2 mb-2">
          <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
          <TextField label="Não conformidade" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} value={description.naoConformidade} />
          <TextField
            label="Requisito descumprido"
            placeholder="Escreva aqui"
            fullWidth
            sx={{ mt: 2 }}
            value={description.requisitoDescumprido}
          />
          <TextField label="Evidência objetiva" placeholder="Escreva aqui" fullWidth sx={{ mt: 2 }} value={description.evidenciaObjetiva} />
        </div>
      );
    });
  };

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="m-3">Descrição</h3>
          <div className="mb-3 mt-3">
            <IconButton sx={{ width: '50px', height: '50px' }} onClick={selectFiles}>
              <UploadFileOutlined></UploadFileOutlined>
            </IconButton>
            {/* <IconButton sx={{ width: '50px', height: '50px' }}>
              <EditOutlined></EditOutlined>
            </IconButton>
            <IconButton sx={{ width: '50px', height: '50px' }}>
              <DeleteOutlined></DeleteOutlined>
            </IconButton> */}
            <Fab color="primary" aria-label="add" size="medium" onClick={addDescription}>
              <Add />
            </Fab>
          </div>
        </div>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <TextField
          label="Não conformidade"
          placeholder="Escreva aqui"
          fullWidth
          sx={{ mt: 2 }}
          value={naoConformidade}
          onChange={event => handleDesc(event.target.value)}
        />
        <TextField
          label="Requisito descumprido"
          placeholder="Escreva aqui"
          fullWidth
          sx={{ mt: 2 }}
          value={requisitoDescumprido}
          onChange={event => setRequisitoDescumprido(event.target.value)}
        />
        <TextField
          label="Evidência objetiva"
          placeholder="Escreva aqui"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          value={evidenciaObjetiva}
          onChange={event => setEvidenciaObjetiva(event.target.value)}
        />

        {renderDescriptions()}
      </Card>
    </>
  );
};

export default DescriptionRnc;
