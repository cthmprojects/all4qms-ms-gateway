/* eslint-disable no-console */
import {
  Box,
  Breadcrumbs,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row } from 'reactstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import DatePicker from 'react-datepicker';
import { Textarea, styled } from '@mui/joy';
import { StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import { AddCircle, Download } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';
import { listEnums } from '../../reducers/enums.reducer';
import { Doc, InfoDoc, Process, StatusEnum } from '../../models';
import { getInfoDocById } from '../../reducers/infodoc.reducer';
import { Storage } from 'react-jhipster';
import { toast } from 'react-toastify';
import { UserQMS } from '../../../../entities/usuario/reducers/usuario.reducer';
import fileDownload from 'js-file-download';

const StyledLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  top: 'calc((var(--Textarea-minHeight) - 1em) / 2)',
  color: theme.vars.palette.text.tertiary,
  fontWeight: 400,
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InnerTextareaNC = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} disabled />
      <StyledLabel htmlFor={id}>Justificativa de Emissão</StyledLabel>
    </React.Fragment>
  );
});

const DocumentDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} disabled />
      <StyledLabel htmlFor={id}>Descrição do documento</StyledLabel>
    </React.Fragment>
  );
});

const getProcesses = async () => {
  const apiUrl = 'services/all4qmsmsgateway/api/processos';
  const response = await axios.get(`${apiUrl}`);
  return response.data;
};

export const DetailDocument = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [emitter, setEmitter] = useState<number | undefined>(undefined);
  const [emittedDate, setEmittedDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('externa');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<number | undefined>(undefined);
  const [noValidate, setNoValidate] = useState(false);
  const [validDate, setValidDate] = useState(new Date());
  const [documentDescription, setDocumentDescription] = useState('');
  const [notificationPreviousDate, setNotificationPreviousDate] = useState('0');
  const [keywordList, setKeywordList] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [currentUser] = useState<UserQMS>(JSON.parse(Storage.session.get('USUARIO_QMS')));

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());
    dispatch(getInfoDocById(id || ''));
    getProcesses().then(data => {
      setProcesses(data);
    });
  }, []);

  const onKeywordChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setKeyword(value);
  };

  const onKeywordRemoved = (event: any, index: number): void => {
    setKeywordList(keywordList.filter((_, idx) => idx !== index));
  };

  const onKeywordAdded = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setKeywordList([...keywordList, keyword]);
    setKeyword('');
  };

  const handleFileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    void onFileClicked(event);
  };

  const onFileClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (actualInfoDoc) {
      const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${actualInfoDoc.doc?.idArquivo}`;

      try {
        const result = await axios.request({
          responseType: 'arraybuffer',
          url: downloadUrl,
          method: 'get',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });

        let fileName = result.headers['content-disposition'].split(';')[1];
        fileName = fileName.split('=')[1];
        fileName = fileName.split('_').slice(5).join('_');

        const file = new Blob([result.data], { type: 'application/octet-stream' });
        fileDownload(file, `${fileName}`);
      } catch (error) {
        console.error('Erro ao baixar arquivo:', error);
        toast.error('Erro ao baixar o arquivo. Tente novamente.');
      }
    }
  };

  const handleBack = () => {
    navigate('/infodoc', { state: { selectedTab: 'HOMOLOGADOS' } });
  };

  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);
  const actualInfoDoc: InfoDoc = useAppSelector(state => state.all4qmsmsgateway.infodoc.entity);

  useEffect(() => {
    if (actualInfoDoc) {
      setEmitter(actualInfoDoc.doc.idUsuarioCriacao);
      setEmittedDate(new Date(actualInfoDoc.doc.dataCricao));
      setDescription(actualInfoDoc.doc.justificativa);
      setCode(actualInfoDoc.doc.codigo);
      setTitle(actualInfoDoc.doc.titulo);
      setOrigin(actualInfoDoc.doc.origem);
      setSelectedProcess(actualInfoDoc.doc.idProcesso);
      setValidDate(new Date(actualInfoDoc.doc.dataValidade));
      setDocumentDescription(actualInfoDoc.doc.descricaoDoc);
      setNotificationPreviousDate(actualInfoDoc.doc.idPrazo?.toString() || '0');
      setKeywordList(actualInfoDoc.doc.distribuicao?.split(',') || []);
      setNoValidate(actualInfoDoc.doc.dataValidade?.toString().includes('2999-12-31'));
    }
  }, [actualInfoDoc]);

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Informação Documentada
          </Link>
          <Typography className="link">Detalhes do Documento</Typography>
        </Breadcrumbs>

        <h1 className="title">Detalhes do Documento</h1>

        <div>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <FormControl style={{ width: '30%' }}>
                <InputLabel>Emissor</InputLabel>
                <Select value={emitter || ''} label="Emissor" disabled>
                  {users?.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div style={{ display: 'flex', alignItems: 'center' }} className="ms-2">
                <h3 className="p-0 m-0" style={{ fontSize: '15px' }}>
                  Situação:
                </h3>
                <h3 className="p-0 m-0 ms-2" style={{ fontSize: '15px', color: '#00000099' }}>
                  {actualInfoDoc?.doc?.revisao && actualInfoDoc?.doc?.revisao > 1 ? 'Revisão' : 'Edição'}
                </h3>
              </div>

              <FormControl className="ms-2 mt-4">
                <DatePicker selected={emittedDate} onChange={() => {}} className="date-picker" dateFormat={'dd/MM/yyyy'} disabled />
                <label htmlFor="" className="rnc-date-label">
                  Data
                </label>
              </FormControl>
            </div>
            <Textarea
              className="w-100"
              slots={{ textarea: InnerTextareaNC }}
              slotProps={{ textarea: { placeholder: '' } }}
              sx={{ borderRadius: '6px' }}
              name="ncArea"
              value={description || ''}
              disabled
              onChange={() => {}}
            />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem' }} className="mt-4">
              Dados do documento
            </h1>
          </div>
          <Grid container gap={2}>
            <Grid item xs={1}>
              <TextField label="Código" name="number" autoComplete="off" value={code} disabled onChange={() => {}} />
            </Grid>
            <Grid item xs>
              <TextField
                sx={{ width: '100%' }}
                label="Título"
                name="number"
                autoComplete="off"
                value={title}
                disabled
                onChange={() => {}}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }} disabled>
                <InputLabel>Origem</InputLabel>
                <Select label="Origem" value={origin} onChange={() => {}}>
                  {enums?.origemDoc?.map(origem => (
                    <MenuItem key={origem.value} value={origem.value}>
                      {origem.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }} disabled>
                <InputLabel>Área / Processo</InputLabel>
                <Select label="Área / Processo" value={selectedProcess} onChange={() => {}}>
                  {processes.map((process: any, i) => (
                    <MenuItem value={process.id} key={`process-${i}`}>
                      {process.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                style={{ backgroundColor: '#E0E0E0', height: '55px' }}
                onClick={handleFileClick}
              >
                <AttachFileIcon className="pe-1 pb-1" />
                Arquivo
              </Button>
            </Grid>
          </Grid>
          <div className="mt-4" style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              className="me-2"
              control={<Checkbox checked={noValidate} onClick={() => {}} />}
              label="Indeterminado"
              disabled
            />
            <FormControl className="me-2 ms-2 mt-4">
              <DatePicker selected={validDate} onChange={() => {}} className="date-picker" dateFormat={'dd/MM/yyyy'} disabled />
              <label htmlFor="" className="rnc-date-label">
                Validade
              </label>
            </FormControl>
            <FormControl sx={{ width: '15%' }} className="me-2 rnc-form-field ms-2">
              <InputLabel>Notificar antes de:</InputLabel>
              <Select
                style={{ height: '66px', boxShadow: 'inset 0 -1px 0 #ddd' }}
                label="Notificar:"
                value={notificationPreviousDate}
                onChange={() => {}}
                disabled
              >
                {enums?.prazoNotificacao?.map(prazo => (
                  <MenuItem key={prazo.value} value={prazo.value}>
                    {prazo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Textarea
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={documentDescription || ''}
            disabled
            onChange={() => {}}
          />

          <div className="mt-4">
            <TextField
              id="text-field-keyword"
              label="Escreva aqui..."
              style={{ width: '40%', maxWidth: '400px', minWidth: '200px' }}
              onChange={onKeywordChanged}
              value={keyword}
              disabled
            />
            <IconButton aria-label="Adicionar palavra chave" onClick={onKeywordAdded} disabled>
              <AddCircle fontSize="large" />
            </IconButton>
          </div>
          <div className="p-2 mt-3" style={{ width: '100%', border: '1px solid #c6c6c6', borderRadius: '4px', minHeight: '100px' }}>
            {keywordList.map((kw, index) => (
              <Chip key={index} label={kw} onDelete={event => onKeywordRemoved(event, index)} className="me-2" disabled />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px', justifyItems: 'right' }} className="mt-5">
            <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={handleBack}>
              VOLTAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDocument;
