import { Add, Delete, DeleteOutlined, UploadFileOutlined } from '@mui/icons-material';
import { Card, Divider, Fab, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './description.css';

type RncDescriptionProps = {
  descriptions: Array<string>;
  evidences: Array<string>;
  requirements: Array<string>;
  rncId?: string | number;
  type: string;
  onDescriptionsChanged: (values: Array<string>) => void;
  onEvidencesChanged: (values: Array<string>) => void;
  onRequirementsChanged: (values: Array<string>) => void;
  onDescriptionsEvidencesChanged: (values: Array<File>) => void;
};

type RncDescription = {
  description: string;
  evidence: string;
  requirement: string;
};

export const DescriptionRnc = ({
  descriptions,
  evidences,
  requirements,
  rncId,
  type,
  onDescriptionsChanged,
  onEvidencesChanged,
  onRequirementsChanged,
  onDescriptionsEvidencesChanged,
}: RncDescriptionProps) => {
  const dispatch = useAppDispatch();
  const [descFiles, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef(null);

  const rncDescriptions = useMemo(() => {
    if (!descriptions || !requirements || !evidences || descriptions.length <= 0 || requirements.length <= 0 || evidences.length <= 0) {
      return [];
    }

    if (
      descriptions.length !== requirements.length ||
      descriptions.length !== evidences.length ||
      requirements.length !== evidences.length
    ) {
      return [];
    }

    const length: number = descriptions.length;

    const allRncDescriptions: Array<RncDescription> = [];

    for (let i = 0; i < length; i++) {
      const description = descriptions[i];
      const requirement = requirements[i];
      const evidence = evidences[i];

      allRncDescriptions.push({
        description: description,
        evidence: evidence,
        requirement: requirement,
      });
    }

    return allRncDescriptions;
  }, [descriptions, evidences, requirements]);

  const onAddDescription = () => {
    if (descriptions.length === 0 && requirements.length === 0 && evidences.length === 0) {
      onDescriptionsChanged(['']);
      onRequirementsChanged(['']);
      onEvidencesChanged(['']);
      return;
    }

    if (
      !descriptions ||
      !requirements ||
      !evidences ||
      !descriptions[descriptions.length - 1] ||
      !requirements[requirements.length - 1] ||
      !evidences[evidences.length - 1]
    ) {
      return;
    }

    onDescriptionsChanged([...descriptions, '']);
    onRequirementsChanged([...requirements, '']);
    onEvidencesChanged([...evidences, '']);
  };

  const onRemoveDescription = (index: number) => {
    if (index === 0 || descriptions.length === 1 || requirements.length === 1 || evidences.length === 1) {
      return;
    }

    const newDescriptions = [...descriptions];
    newDescriptions.splice(index, 1);
    onDescriptionsChanged(newDescriptions);

    const newRequirement = [...requirements];
    newRequirement.splice(index, 1);
    onRequirementsChanged(newRequirement);

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

  const getDescriptionLabel = useCallback(
    (index: number) => {
      const prefix: string = type === 'NC' ? 'Não conformidade ' : 'Oportunidade de melhoria ';

      return prefix + index;
    },
    [type]
  );

  const getRequirementsLabel = useCallback(
    (index: number) => {
      const prefix: string = type === 'NC' ? 'Requisito descumprido ' : 'Detalhes ';

      return prefix + index;
    },
    [type]
  );

  const renderRncDescriptions = () => {
    if (rncDescriptions.length > 0) {
      return (
        <>
          {rncDescriptions.map((rncDescription, index) => {
            const { description, evidence, requirement } = rncDescription;

            return (
              <div key={index} className="mt-2 mb-2" style={{ position: 'relative' }}>
                <Stack spacing={2}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label={getDescriptionLabel(index + 1)}
                      fullWidth
                      maxRows={5}
                      multiline
                      sx={{ mt: 2 }}
                      value={description}
                      onChange={event => {
                        const newDescriptions = [...descriptions];
                        newDescriptions[index] = event.target.value;
                        onDescriptionsChanged(newDescriptions);
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label={getRequirementsLabel(index + 1)}
                      fullWidth
                      maxRows={5}
                      multiline
                      sx={{ mt: 2 }}
                      value={requirement}
                      onChange={event => {
                        const newRequirements = [...requirements];
                        newRequirements[index] = event.target.value;
                        onRequirementsChanged(newRequirements);
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label={`Evidência objetiva ${index + 1}`}
                      fullWidth
                      maxRows={5}
                      multiline
                      sx={{ mt: 2 }}
                      value={evidence}
                      onChange={event => {
                        const newEvidences = [...evidences];
                        newEvidences[index] = event.target.value;
                        onEvidencesChanged(newEvidences);
                      }}
                    />
                  </div>
                </Stack>

                <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />

                {index > 0 && (
                  <Tooltip title="Remover descrição">
                    <Fab color="primary" aria-label="add" size="medium" onClick={() => onRemoveDescription(index)}>
                      <Delete />
                    </Fab>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </>
      );
    } else {
      return <>Nenhuma descrição adicionada.</>;
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
            <Tooltip title="Adicione uma nova descrição">
              <Fab
                disabled={!descriptions || !requirements || !evidences}
                color="primary"
                aria-label="add"
                size="medium"
                onClick={onAddDescription}
              >
                <Add />
              </Fab>
            </Tooltip>
          </div>
        </div>

        {renderRncDescriptions()}

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
