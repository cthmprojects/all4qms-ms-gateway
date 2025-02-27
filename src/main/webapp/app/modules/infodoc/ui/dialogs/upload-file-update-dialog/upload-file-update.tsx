import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Button } from 'reactstrap';
import './upload-files.css';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { createInfoDoc, deleteInfoDoc } from 'app/modules/infodoc/reducers/infodoc.reducer';
import { Doc, UploadAnexo } from 'app/modules/infodoc/models';
import { uploadAnexo } from 'app/modules/infodoc/reducers/anexo.reducer';

type UploadFileModalProps = {
  open: boolean;
  handleClose: () => void;
  id: number;
  SetFile?: React.Dispatch<React.SetStateAction<File>>;
};

const UploadInfoFileUpdate = ({ open, handleClose, id }: UploadFileModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [files, setFiles] = useState<Array<File>>([]);
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

  const saveFile = () => {
    if (files.length == 0) return;

    const newFile: UploadAnexo = {
      arquivo: files[0],
    };

    dispatch(uploadAnexo(newFile)).then((response: any) => {
      if (response?.error) {
        handleClose();
        return;
      }

      if (response.payload?.data?.id) {
        navigate(`/infodoc/upload-file/update/${id}/${response.payload?.data?.id}`);
      }

      handleClose();
    });
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          <h2>Enviar arquivos</h2>
        </DialogTitle>
        <DialogContent>
          <input type="file" style={{ display: 'none' }} onChange={onFileChanged} ref={fileInputRef} accept="application/pdf" />

          {files.length == 0 && (
            <button
              className="button-upload"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
            >
              <FontAwesomeIcon icon="folder-open" /> <br />
              <span
                style={{
                  fontSize: '25px',
                  lineHeight: '1px',
                }}
              >
                Selecionar ou soltar um arquivo do computador
              </span>
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
          <Button disabled={files.length == 0} className="add-button me-3 format-button" onClick={saveFile}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UploadInfoFileUpdate;
