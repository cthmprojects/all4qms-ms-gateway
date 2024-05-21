import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Button } from 'reactstrap';
import './upload-files.css';
import { useNavigate } from 'react-router-dom';

type UploadFileModalProps = {
  open: boolean;
  handleClose: () => void;
};

const UploadInfoFile = ({ open, handleClose }: UploadFileModalProps) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const onFileChanged = event => {
    const files = event.target.files;
    setFiles([...files]);
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          <h2>Enviar arquivos</h2>
        </DialogTitle>
        <DialogContent>
          <input type="file" style={{ display: 'none' }} onChange={onFileChanged} ref={fileInputRef} />

          {files.length == 0 && (
            <button
              className="button-upload"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
            >
              <FontAwesomeIcon icon="folder-open" />
              <span>Selecionar ou soltar um arquivo do computador</span>
            </button>
          )}

          {files.length > 0 && (
            <div className="files-list">
              {files.map((file, index) => (
                <div key={index} className="uploaded-file">
                  <div className="file-info">
                    <FontAwesomeIcon icon="file" />
                    <span>{file.name}</span>
                  </div>
                  <div className="file-actions">
                    <button onClick={() => removeSelectedFile(index)}>
                      <span>Remover</span>
                      <FontAwesomeIcon icon="xmark" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ paddingBottom: '20px' }}>
          <Button className="me-2 format-button" onClick={handleClose}>
            Voltar
          </Button>
          <Button
            disabled={files.length == 0}
            className="add-button me-3 format-button"
            onClick={() => navigate('/infodoc/upload-file/new')}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UploadInfoFile;
