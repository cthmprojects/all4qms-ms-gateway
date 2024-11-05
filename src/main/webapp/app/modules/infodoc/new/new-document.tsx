import {
  Box,
  Breadcrumbs,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers, UserQMS } from 'app/entities/usuario/reducers/usuario.reducer';
import { IUsuario } from 'app/shared/model/usuario.model';
import DatePicker from 'react-datepicker';
import { Textarea, styled } from '@mui/joy';
import { StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { AddCircle } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios, { AxiosResponse } from 'axios';
import downloadFile from '../infodoc-store';
import { listEnums } from '../reducers/enums.reducer';
import { toast } from 'react-toastify';
import {
  SendEmail,
  createInfoDoc,
  deleteInfoDoc,
  getInfoDocById,
  notifyEmailAllSGQs,
  notifyEmailInfoDoc,
  updateInfoDoc,
} from '../reducers/infodoc.reducer';
import { InfoDoc, Doc, Movimentacao, EnumTipoMovDoc, EnumStatusDoc, EnumSituacao } from '../models';
import { downloadAnexo } from '../reducers/anexo.reducer';
import { atualizarMovimentacao, cadastrarMovimentacao } from '../reducers/movimentacao.reducer';
import { Storage } from 'react-jhipster';
import { getUsersAsAdminSGQ } from '../../administration/user-management/user-management.reducer';
import { getUsersByProcess } from '../../../entities/usuario/reducers/usuario.reducer';
import { getUsersAsGQ } from '../../../entities/usuario/usuario.reducer';

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
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Justificativa de Emissão</StyledLabel>
    </React.Fragment>
  );
});

const DocumentDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Descrição do documento</StyledLabel>
    </React.Fragment>
  );
});

const getProcesses = async () => {
  const apiUrl = 'services/all4qmsmsgateway/api/processos';
  const response = await axios.get(`${apiUrl}`);
  return response.data;
};

export const NewDocument = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [emitter, setEmitter] = useState('');
  const [emittedDate, setEmittedDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('externa');
  const [originList, setOriginList] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [noValidate, setNoValidate] = useState(false);
  const [validDate, setValidDate] = useState(new Date());
  const [documentDescription, setDocumentDescription] = useState('');
  const [notificationPreviousDate, setNotificationPreviousDate] = useState('0');
  const [currentUser, _] = useState(JSON.parse(Storage.session.get('USUARIO_QMS')));
  const [usersSGQ, setUsersSGQ] = useState<UserQMS[]>([]);
  const [infoDocId, setInfoDocId] = useState(-1);
  const [infoDocMovimentacao, setInfoDocMovimentacao] = useState(-1);
  const [keywordList, setKeywordList] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());
    setEmitter(currentUser.id);

    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        setSelectedProcess(data[0].id);
        getUsersSGQ(data[0].id);
      }
    });
  }, []);

  const getUsersSGQ = async idProcess => {
    const resUsers = await dispatch(getUsersAsGQ('ROLE_SGQ'));
    const users_ = (resUsers.payload as AxiosResponse).data || [];

    const resUsersByProcess = await dispatch(getUsersByProcess(idProcess));
    const usersByProcess_ = (resUsersByProcess.payload as AxiosResponse).data || [];

    const filteredUserByProcess: UserQMS[] = usersByProcess_.filter((userPro: UserQMS) =>
      users_.some(firstUser => firstUser.id === userPro.user.id)
    );
    setUsersSGQ(filteredUserByProcess);
  };

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

  const onFileClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    if (id) {
      const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${id}`;

      await axios
        .request({
          responseType: 'arraybuffer',
          url: downloadUrl,
          method: 'get',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        })
        .then(result => {
          var fileDownload = require('js-file-download');
          let fileName = result.headers['content-disposition'].split(';')[1];
          fileName = fileName.split('=')[1];
          fileName = fileName.split('_').pop()!!;

          const file = new Blob([result.data], { type: 'application/octet-stream' });

          fileDownload(file, `${fileName}`);
          setIsLoading(false);
        });
    }
    setIsLoading(false);
  };

  const cancelDocument = () => {
    navigate('/infodoc');
  };

  const onNoValidateChanged = () => {
    if (noValidate) {
      setNoValidate(false);
      setValidDate(new Date());
    } else {
      setNoValidate(true);
      setValidDate(new Date(9999, 11, 31));
      setNotificationPreviousDate('0');
    }
  };

  const validateFields = () => {
    return emitter && emittedDate && selectedProcess && description;
  };

  const saveDocument = async () => {
    setIsLoading(true);
    try {
      const newInfoDoc: Doc = {
        idUsuarioCriacao: parseInt(emitter),
        dataCricao: emittedDate,
        descricaoDoc: description,
        justificativa: '',
        codigo: '',
        titulo: '',
        origem: 'I',
        idProcesso: parseInt(selectedProcess),
        idArquivo: parseInt(id!!),
        ignorarValidade: true,
        enumSituacao: EnumSituacao.EDICAO,
        tipoDoc: 'MA',
        revisao: 0,
      };

      if (!noValidate) {
        newInfoDoc.ignorarValidade = false;
        newInfoDoc.dataValidade = validDate;
      }

      let resStoreDoc;
      if (infoDocId > 0) {
        newInfoDoc.id = infoDocId;
        resStoreDoc = await dispatch(updateInfoDoc({ data: newInfoDoc, id: newInfoDoc.id!! }));
      } else {
        resStoreDoc = await dispatch(createInfoDoc(newInfoDoc));
      }

      const resDoc: InfoDoc = (resStoreDoc.payload as AxiosResponse).data || {};
      if (resDoc) {
        setIsLoading(false);
        setInfoDocId(resDoc?.doc?.id || -1);
        setInfoDocMovimentacao(resDoc?.movimentacao?.id || -1);
        toast.success(`Documento ${resDoc?.doc?.id} Salvo com sucesso!`);

        return resDoc;
      } else {
        toast.error(`Não foi possivel salvar Documento, tente novamente mais tarde!`);
        setIsLoading(false);
        return null;
      }
    } catch (err) {
      console.error('Error new document:', err);
      toast.error(`Não foi possivel salvar Documento, tente novamente mais tarde!`);
      setIsLoading(false);
      return null;
    }
  };

  const fowardDocument = async () => {
    if (!validateFields()) {
      toast.warn(`Os campos de Emissor, Área/Proceso e Justificativa de Emissão, SÃO OBRIGATÓRIOS!`);
      return null;
    }

    setIsLoading(true);

    const resDoc = await saveDocument();

    if (resDoc) {
      const novaMovimentacao: Movimentacao = {
        id: resDoc.movimentacao?.id,
        enumTipoMovDoc: EnumTipoMovDoc.EMITIR,
        enumStatus: EnumStatusDoc.VALIDACAO,
        idDocumentacao: resDoc.doc.id,
        idUsuarioCriacao: currentUser.id,
      };

      //     console.log('userSgq: ', usersSGQ);

      dispatch(atualizarMovimentacao(novaMovimentacao));

      dispatch(notifyEmailAllSGQs(usersSGQ));
      toast.success(`Documento ${resDoc?.doc?.id} Encaminhado com sucesso!`);
      setIsLoading(false);
      navigate('/infodoc');
    } else {
      toast.error(`Não foi possivel Salvar e Encaminhar Documento, tente novamente mais tarde!`);
    }
  };

  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);

  useEffect(() => {
    setOriginList(enums?.origem);

    if (enums?.origem.length > 0) {
      setOrigin(enums.origem[0].nome);
    }
  }, [enums]);

  const changeProcess = event => {
    setSelectedProcess(event.target.value);
    getUsersSGQ(event.target.value);
  };

  return (
    <>
      <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5 mb-5">
        <Row className="justify-content-center mt-5">
          <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Informações documentadas
            </Link>
            <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Emitir
            </Link>
            {/* <Typography style={{ color: '#606060' }}>Ficha de estoque</Typography> */}
          </Breadcrumbs>
        </Row>

        <div className="container-style mt-5 ms-3">
          <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl style={{ width: '30%' }}>
              <InputLabel>Emissor</InputLabel>
              <Select label="Emissor" value={emitter} onChange={event => setEmitter(event.target.value)}>
                {users.map((user, i) => (
                  <MenuItem value={user.id} key={`user-${i}`}>
                    {user.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3 className="p-0 m-0" style={{ fontSize: '15px' }}>
                  Status:
                </h3>
                <h3 className="p-0 m-0 ms-2" style={{ fontSize: '15px', color: '#00000099' }}>
                  Em emissão
                </h3>
                <img src="../../../../content/images/icone-emissao.png" className="ms-2" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }} className="ms-2">
                <h3 className="p-0 m-0" style={{ fontSize: '15px' }}>
                  Situação:
                </h3>
                <h3 className="p-0 m-0 ms-2" style={{ fontSize: '15px', color: '#00000099' }}>
                  Edição
                </h3>
                <img src="../../../../content/images/icone-emissao.png" className="ms-2" />
              </div>

              <FormControl className="ms-2 mt-4">
                <DatePicker
                  selected={emittedDate}
                  onChange={date => setEmittedDate(date)}
                  className="date-picker"
                  dateFormat={'dd/MM/yyyy'}
                />
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
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem' }} className="mt-4">
              Dados do documento
            </h1>
          </div>

          <Grid container gap={2}>
            <Grid item xs={1}>
              <TextField label="Código" name="number" autoComplete="off" value={code} disabled onChange={e => setCode(e.target.value)} />
            </Grid>
            <Grid item xs={4}>
              <TextField
                sx={{ width: '100%' }}
                label="Título"
                name="number"
                autoComplete="off"
                value={title}
                disabled
                onChange={e => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Origem</InputLabel>
                <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)}>
                  {originList?.map((e: any, idx) => (
                    <MenuItem key={idx} value={e.nome}>
                      {e.valor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Área / Processo</InputLabel>
                <Select label="Área / Processo" value={selectedProcess} onChange={event => setSelectedProcess(event.target.value)}>
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
                onClick={event => onFileClicked(event)}
              >
                <AttachFileIcon className="pe-1 pb-1" />
                Arquivo
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
            <FormControlLabel
              className="me-2"
              control={<Checkbox checked={noValidate} onClick={() => onNoValidateChanged()} />}
              label="Indeterminado"
              disabled
            />
            <FormControl style={{ height: '60px', width: '190px' }} disabled>
              <DatePicker
                selected={validDate}
                onChange={date => setValidDate(date)}
                className="date-picker"
                dateFormat={'dd/MM/yyyy'}
                disabled
              />
              <label htmlFor="" className="rnc-date-label" style={{ width: '70px' }}>
                Validade
              </label>
            </FormControl>
            <FormControl style={{ height: '60px', width: '190px' }} disabled>
              <InputLabel>Notificar antes de:</InputLabel>
              <Select
                disabled
                style={{ height: '66px', boxShadow: 'inset 0 -1px 0 #ddd', width: '100%' }}
                label="Notificar antes de:"
                value={notificationPreviousDate}
                onChange={event => setNotificationPreviousDate(event.target.value)}
              >
                <MenuItem value="0">Não notificar</MenuItem>
                <MenuItem value="15d">15 dias antes</MenuItem>
                <MenuItem value="30d">30 dias antes</MenuItem>
                <MenuItem value="45d">45 dias antes</MenuItem>
                <MenuItem value="60d">60 dias antes</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Textarea
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={documentDescription || ''}
            onChange={e => setDocumentDescription(e.target.value)}
            disabled
          />

          {/* <div className="mt-4">
            <TextField
              id="text-field-keyword"
              label="Documentos relacionados"
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
            {keywordList.map((keyword: string, index: number) => (
              <Chip key={index} label={keyword} onDelete={event => onKeywordRemoved(event, index)} className="me-2" />
            ))}
          </div> */}

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => cancelDocument()}
            >
              Voltar
            </Button>
            <Button onClick={() => saveDocument()}>
              {' '}
              {/* disabled={!validateFields()}>*/}
              Salvar
            </Button>
            <Button
              // disabled={!validateFields()}
              onClick={() => fowardDocument()}
              className="ms-3"
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
            >
              Encaminhar
            </Button>
          </div>
        </div>
      </div>
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            width: '100vw',
            height: '100vh',
            background: '#c6c6c6',
            opacity: 0.5,
            zIndex: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={80} />
        </Box>
      )}
    </>
  );
};

export default NewDocument;
