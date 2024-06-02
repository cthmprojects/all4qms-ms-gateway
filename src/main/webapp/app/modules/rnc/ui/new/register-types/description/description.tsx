import { Add, DeleteOutlined, UploadFileOutlined } from '@mui/icons-material';
import { Card, Divider, Fab, IconButton, TextField, Tooltip } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import React, { useRef, useState } from 'react';
import './description.css';

type RncDescriptionProps = {
  description: string;
  evidences: Array<string>;
  requirement: string;
  rncId?: string | number;
  onDescriptionChanged: (value: string) => void;
  onEvidencesChanged: (values: Array<string>) => void;
  onRequirementChanged: (value: string) => void;
  onDescriptionsEvidencesChanged: (values: Array<File>) => void;
};

export const DescriptionRnc = ({
  description,
  evidences,
  requirement,
  rncId,
  onDescriptionChanged,
  onEvidencesChanged,
  onRequirementChanged,
  onDescriptionsEvidencesChanged,
}: RncDescriptionProps) => {
  const dispatch = useAppDispatch();
  const [descFiles, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef(null);

  const onAddEvidence = () => {
    if (!description || !requirement || !evidences || !evidences[0]) return;

    onEvidencesChanged([...evidences, '']);
  };

  const onRemoveEvidence = (index: number) => {
    if (index === 0 || evidences.length === 1) return;

    const newEvidences = [...evidences];
    newEvidences.splice(index, 1);
    onEvidencesChanged(newEvidences);
  };

  const onFileChanged = event => {
    const files = event.target.files;

    if (!files || files.length <= 0) return;

    const file = files[0];

    setFiles([...descFiles, file]);
    onDescriptionsEvidencesChanged([...descFiles, file]);
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...descFiles];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onDescriptionsEvidencesChanged(newFiles);
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

  const renderEvidences = () => {
    if (evidences.length > 0) {
      console.log(evidences);

      return (
        <>
          {evidences.map((evidencia, index) => (
            <div key={index} className="mt-2 mb-2" style={{ position: 'relative' }}>
              <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label={`Evidência objetiva ${index + 1}`}
                  fullWidth
                  sx={{ mt: 2 }}
                  value={evidencia}
                  onChange={event => {
                    const newEvidences = [...evidences];
                    newEvidences[index] = event.target.value;
                    onEvidencesChanged(newEvidences);
                  }}
                />
                {index > 0 && (
                  <IconButton sx={{ marginTop: '8px', marginLeft: '8px' }} onClick={() => onRemoveEvidence(index)}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <>
          <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label={`Evidência objetiva 1`}
              fullWidth
              sx={{ mt: 2 }}
              value={evidences[0]}
              onChange={event => {
                onEvidencesChanged([event.target.value]);
              }}
            />
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Card className="pb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="m-3">Descrição</h3>
          <div className="mb-3 mt-3">
            <input type="file" multiple style={{ display: 'none' }} onChange={onFileChanged} ref={fileInputRef} />
            <Tooltip title="Enviar arquivo de evidência">
              <IconButton
                sx={{ width: '50px', height: '50px' }}
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
              >
                <UploadFileOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Adicione uma nova evidência">
              <Fab
                disabled={!description || !requirement || !evidences}
                color="primary"
                aria-label="add"
                size="medium"
                onClick={onAddEvidence}
              >
                <Add />
              </Fab>
            </Tooltip>
          </div>
        </div>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <TextField
          label="Não conformidade"
          placeholder="Escreva aqui"
          fullWidth
          sx={{ mt: 2 }}
          value={description}
          onChange={event => onDescriptionChanged(event.target.value)}
        />
        <TextField
          label="Requisito descumprido"
          placeholder="Escreva aqui"
          fullWidth
          sx={{ mt: 2 }}
          value={requirement}
          onChange={event => onRequirementChanged(event.target.value)}
        />

        {renderEvidences()}

        {descFiles.length > 0 && (
          <div className="mt-2 mb-2">
            <Divider variant="middle" sx={{ margin: ' 0.5rem 0px !important' }} />
            <div>
              <h5>Arquivos Selecionados:</h5>
              {descFiles.map((file, index) => (
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
