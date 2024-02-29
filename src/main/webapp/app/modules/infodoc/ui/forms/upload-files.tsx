import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumbs, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'reactstrap';
import './upload-files.css';

const UploadInfoFile = () => {
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
    <>
      <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
        <Row className="justify-content-center mt-5">
          <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Informação Documentada
            </Link>
            <Typography style={{ color: '#606060' }}>Enviar arquivos</Typography>
          </Breadcrumbs>
          <h2 className="ms-5 mt-5">Enviar arquivos</h2>
        </Row>
        <div className="upload-container">
          <input type="file" multiple style={{ display: 'none' }} onChange={onFileChanged} ref={fileInputRef} />

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
        </div>
      </div>
    </>
    // <div>
    //     a
    //     <div className="form-group">
    //         <label htmlFor="file">File</label>
    //         <input type="file" className="form-control" id="file" name="file" onChange={handleFileChange} />
    //     </div>
    //     <div className="form-group">
    //         <label htmlFor="description">Description</label>
    //         <input type="text" className="form-control" id="description" name="description" onChange={handleDescriptionChange} />
    //     </div>
    //     <div className="form-group">
    //         <button type="button" className="btn btn-primary" onClick={handleUploadFile}>Upload</button>
    //     </div>
    // </div>
  );
};

export default UploadInfoFile;
