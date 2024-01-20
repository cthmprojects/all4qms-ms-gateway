import React, { useState, useRef } from 'react';
import './description.css';
import { Card, Divider, Fab, IconButton, TextField } from '@mui/material';
import { Add, DeleteOutlined, UploadFileOutlined } from '@mui/icons-material';

export const DescriptionRnc = ({ handleDescricao }) => {
  const [naoConformidade, setNaoConformidade] = useState('');
  const [requisitoDescumprido, setRequisitoDescumprido] = useState('');
  const [evidenciasObjetivas, setEvidenciasObjetivas] = useState(['']);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDesc = value => {
    setNaoConformidade(value);
    handleDescricao(value);
  };

  const addEvidenciaObjetiva = () => {
    if (!naoConformidade || !requisitoDescumprido || !evidenciasObjetivas[0]) return;

    setEvidenciasObjetivas([...evidenciasObjetivas, '']);
  };

  const removeEvidenciaObjetiva = index => {
    if (index === 0 || evidenciasObjetivas.length === 1) return;

    const updatedEvidencias = [...evidenciasObjetivas];
    updatedEvidencias.splice(index, 1);
    setEvidenciasObjetivas(updatedEvidencias);
  };

  const handleFileChange = event => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeSelectedFile = index => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const downloadFile = file => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="m-3">Descrição</h3>
          <div className="mb-3 mt-3">
            <input type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} ref={fileInputRef} />
            <IconButton
              sx={{ width: '50px', height: '50px' }}
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
            >
              <UploadFileOutlined />
            </IconButton>
            <Fab
              disabled={!naoConformidade || !requisitoDescumprido || !evidenciasObjetivas[0]}
              color="primary"
              aria-label="add"
              size="medium"
              onClick={addEvidenciaObjetiva}
            >
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

        {evidenciasObjetivas.map((evidencia, index) => (
          <div key={index} className="mt-2 mb-2" style={{ position: 'relative' }}>
            <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label={`Evidência objetiva ${index + 1}`}
                fullWidth
                sx={{ mt: 2 }}
                value={evidencia}
                onChange={event => {
                  const updatedEvidencias = [...evidenciasObjetivas];
                  updatedEvidencias[index] = event.target.value;
                  setEvidenciasObjetivas(updatedEvidencias);
                }}
              />
              {index > 0 && (
                <IconButton sx={{ marginTop: '8px', marginLeft: '8px' }} onClick={() => removeEvidenciaObjetiva(index)}>
                  <DeleteOutlined />
                </IconButton>
              )}
            </div>
          </div>
        ))}

        {selectedFiles.length > 0 && (
          <div className="mt-2 mb-2">
            <Divider variant="middle" sx={{ margin: ' 0.5rem 0px !important' }} />
            <div>
              <h5>Arquivos Selecionados:</h5>
              {selectedFiles.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      downloadFile(file);
                    }}
                    style={{ marginRight: '8px', fontWeight: 'normal', color: 'blue' }}
                  >
                    {file.name}
                  </a>
                  <IconButton sx={{ marginBottom: '2px', marginLeft: '4px' }} onClick={() => removeSelectedFile(index)}>
                    <DeleteOutlined />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default DescriptionRnc;
