import { Card, Divider, Fab, IconButton, TextField, Tooltip } from '@mui/material';
import { Add, DeleteOutlined, UploadFileOutlined } from '@mui/icons-material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useRef, useState } from 'react';
import './description.css';
import { getDescription } from 'app/modules/rnc/reducers/description.reducer';
import { DescriptionResponse, EvidenciaAnexo } from 'app/modules/rnc/models';

type RncDescriptionProps = {
  description: Array<DescriptionResponse>;
  rncId?: string;
  onDescriptionChanged: (value: Array<DescriptionResponse>) => void;
};

export const DescriptionRnc = ({ description, rncId, onDescriptionChanged }: RncDescriptionProps) => {
  const dispatch = useAppDispatch();
  const [descFiles, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef(null);
  const [detalhesNaoConformidade, setDetalhesNaoConformidade] = useState('');
  const [requisitoDescumprido, setRequisitoDescumprido] = useState('');
  const [anexos, setAnexos] = useState<Array<EvidenciaAnexo>>([]);

  useEffect(() => {
    getDescription(rncId).then(response => {
      const descriptionEntity = response.data;

      let detalhesNaoConformidade = '';
      let requisitoDescumprido = '';
      let _descriptions: Array<DescriptionResponse> = [];
      let _anexos: Array<EvidenciaAnexo> = [];

      if (descriptionEntity) {
        detalhesNaoConformidade = descriptionEntity[0].detalhesNaoConformidade;
        requisitoDescumprido = descriptionEntity[0].requisitoDescumprido;
        setDetalhesNaoConformidade(detalhesNaoConformidade);
        setRequisitoDescumprido(requisitoDescumprido);

        descriptionEntity.map(e => {
          _anexos.push({
            anexos: e.anexos,
            evidenciaObjetiva: e.evidenciaObjetiva,
          });

          _descriptions.push({
            id: e.id,
            detalhesNaoConformidade: detalhesNaoConformidade,
            requisitoDescumprido: requisitoDescumprido,
            evidenciaObjetiva: e.evidenciaObjetiva,
            idNaoConformidade: e.idNaoConformidade,
            anexos: e.anexos,
          });
        });
        onDescriptionChanged(_descriptions);
        setAnexos(_anexos);
      }
    });
  }, [rncId]);

  const onDetalhesNaoConformidadeChanged = (value: string) => {
    setDetalhesNaoConformidade(value);

    if (description) {
      let descriptionList = description;
      let newDescription: DescriptionResponse = {
        id: description[0].id,
        detalhesNaoConformidade: value,
        requisitoDescumprido: description[0].requisitoDescumprido,
        evidenciaObjetiva: description[0].evidenciaObjetiva,
        idNaoConformidade: description[0].idNaoConformidade,
        anexos: description[0].anexos,
        anexosRequest: description[0].anexosRequest,
      };

      descriptionList[0] = newDescription;

      onDescriptionChanged(descriptionList);
    } else {
      let newDescription: DescriptionResponse = {
        id: 0,
        detalhesNaoConformidade: value,
        requisitoDescumprido: '',
        evidenciaObjetiva: '',
        idNaoConformidade: parseInt(rncId),
      };

      onDescriptionChanged([newDescription]);
    }
  };

  const onRequisitoDescumpridoChanged = (value: string) => {
    setRequisitoDescumprido(value);

    if (description) {
      let descriptionList = description;
      let newDescription: DescriptionResponse = {
        id: description[0].id,
        detalhesNaoConformidade: description[0].detalhesNaoConformidade,
        requisitoDescumprido: value,
        evidenciaObjetiva: description[0].evidenciaObjetiva,
        idNaoConformidade: description[0].idNaoConformidade,
        anexos: description[0].anexos,
        anexosRequest: description[0].anexosRequest,
      };

      descriptionList[0] = newDescription;

      onDescriptionChanged(descriptionList);
    } else {
      let newDescription: DescriptionResponse = {
        id: 0,
        detalhesNaoConformidade: '',
        requisitoDescumprido: value,
        evidenciaObjetiva: '',
        idNaoConformidade: parseInt(rncId),
      };

      onDescriptionChanged([newDescription]);
    }
  };

  const onAddEvidence = () => {
    // onDescriptionChanged

    setAnexos([...anexos, { evidenciaObjetiva: '' }]);
  };
  // const onAddEvidence = () => {
  //   if (!description || !requirement || !evidences || !evidences[0]) return;

  //   onEvidencesChanged([...evidences, '']);
  // };

  // const onRemoveEvidence = (index: number) => {
  //   if (index === 0 || evidences.length === 1) return;

  //   const newEvidences = [...evidences];
  //   newEvidences.splice(index, 1);
  //   onEvidencesChanged(newEvidences);
  // };
  const onRequisitoDescumpridoChanged = (value: string) => {
    setRequisitoDescumprido(value);

    if (description) {
      let descriptionList = description;
      let newDescription: DescriptionResponse = {
        id: description[0].id,
        detalhesNaoConformidade: description[0].detalhesNaoConformidade,
        requisitoDescumprido: value,
        evidenciaObjetiva: description[0].evidenciaObjetiva,
        idNaoConformidade: description[0].idNaoConformidade,
        anexos: description[0].anexos,
        anexosRequest: description[0].anexosRequest,
      };

      descriptionList[0] = newDescription;

      onDescriptionChanged(descriptionList);
    } else {
      let newDescription: DescriptionResponse = {
        id: 0,
        detalhesNaoConformidade: '',
        requisitoDescumprido: value,
        evidenciaObjetiva: '',
        idNaoConformidade: parseInt(rncId),
      };

      onDescriptionChanged([newDescription]);
    }
  };

  // const onAddEvidence = () => {
  //   if (!description || !requirement || !evidences || !evidences[0]) return;

  //   onEvidencesChanged([...evidences, '']);
  // };

  // const onRemoveEvidence = (index: number) => {
  //   if (index === 0 || evidences.length === 1) return;

  //   const newEvidences = [...evidences];
  //   newEvidences.splice(index, 1);
  //   onEvidencesChanged(newEvidences);
  // };

  const onFileChanged = event => {
    const files = event.target.files;
    console.log(files);

    // if (!files) return;
    // setFiles([...descFiles, files]);
    // onDescriptionsEvidencesChanged([...descFiles, files]);
  };

  // const removeSelectedFile = (index: number) => {
  //   const newFiles = [...descFiles];
  //   newFiles.splice(index, 1);
  //   setFiles(newFiles);
  //   onDescriptionsEvidencesChanged(newFiles);
  // };

  // const downloadFile = file => {
  //   const url = URL.createObjectURL(file);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = file.name;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

  // const renderEvidences = () => {
  //   console.log(evidences);
  //   if (evidences.length > 0) {

  //     return (
  //       <>

  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
  //         <div style={{ display: 'flex', alignItems: 'center' }}>
  //           <TextField
  //             label={`Evidência objetiva 1`}
  //             fullWidth
  //             sx={{ mt: 2 }}
  //             value={evidences[0]}
  //             onChange={event => {
  //               onEvidencesChanged([event.target.value]);
  //             }}
  //           />
  //         </div>
  //       </>
  //     );
  //   }
  // };

  const removeEvidenciaObjetiva = id => {
    let newAnexos = anexos.filter((evidencia, index) => index !== id);

    let descriptions = description;
    descriptions[id].anexos = null;
    descriptions[id].evidenciaObjetiva = null;
    setAnexos(newAnexos);
    onDescriptionChanged(descriptions);
  };

  const removeAnexos = id => {
    let newAnexos = anexos;
    newAnexos[id].anexos = null;

    let descriptions = description;
    descriptions[id].anexos = null;
    console.log(newAnexos);

    setAnexos(newAnexos);
    onDescriptionChanged(descriptions);
  };

  return (
    <>
      <Card className="pb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="m-3">Descrição</h3>
          <div className="mb-3 mt-3">
            <input type="file" multiple style={{ display: 'none' }} onChange={onFileChanged} ref={fileInputRef} />
            <Tooltip title="Adicione uma nova evidência">
              <Fab
                // disabled={!description[0].detalhesNaoConformidade || !description[0].anexosRequest || !description[0].evidenciaObjetiva}
                color="primary"
                aria-label="add"
                size="medium"
                // onClick={onAddEvidence}
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
          value={detalhesNaoConformidade}
          onChange={event => onDetalhesNaoConformidadeChanged(event.target.value)}
        />
        <TextField
          label="Requisito descumprido"
          placeholder="Escreva aqui"
          fullWidth
          sx={{ mt: 2 }}
          value={requisitoDescumprido}
          onChange={event => onRequisitoDescumpridoChanged(event.target.value)}
        />

        {anexos.map((element: EvidenciaAnexo, index) => (
          <div className="d-flex mt-2" style={{ flexDirection: 'column' }} key={index}>
            <div className="mt-2 mb-2 d-flex" style={{ alignItems: 'center' }}>
              <input type="file" multiple style={{ display: 'none' }} onChange={onFileChanged} ref={fileInputRef} />
              <Tooltip title="Enviar arquivo de evidência" className="mt-3">
                <IconButton
                  sx={{ width: '50px', height: '50px' }}
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                >
                  <UploadFileOutlined />
                </IconButton>
              </Tooltip>
              <TextField
                label={`Evidência objetiva ${index + 1}`}
                fullWidth
                value={element.evidenciaObjetiva}
                // onChange={event => {
                //   const newEvidences = [...evidences];
                //   newEvidences[index] = event.target.value;
                //   onEvidencesChanged(newEvidences);
                // }}
              />
              <IconButton sx={{ marginTop: '8px', marginLeft: '8px' }} onClick={() => removeEvidenciaObjetiva(index)}>
                <DeleteOutlined />
              </IconButton>
            </div>

            {element.anexos?.length > 0 && (
              <div key={index}>
                <div style={{ display: 'flex', alignItems: 'center' }} className="ms-1" key={index}>
                  <IconButton onClick={() => removeAnexos(index)}>
                    <CloseOutlinedIcon />
                  </IconButton>
                  <a
                    href="#"
                    // onClick={e => {
                    //   e.preventDefault();
                    //   downloadFile(file);
                    // }}
                    className="ms-1"
                    style={{ fontWeight: 'normal', color: 'blue' }}
                  >
                    {element.anexos[0].nomeArquivoFisico}
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* {anexos.map((element, index) => {

        })} */}

        {/* {evidences.map((evidencia, index) => (
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
        )} */}
      </Card>
    </>
  );
};

export default DescriptionRnc;
