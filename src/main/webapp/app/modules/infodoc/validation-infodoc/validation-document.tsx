/* eslint-disable no-console */
import {
  Box,
  Breadcrumbs,
  Button,
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
import { Row } from 'reactstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import DatePicker from 'react-datepicker';
import { Textarea, styled } from '@mui/joy';
import { StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import { AddCircle, Download, UploadFile } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import axios, { AxiosResponse } from 'axios';
import { RejectDocumentDialog } from '../ui/dialogs/reject-document-dialog/reject-document-dialog';
import { listEnums } from '../reducers/enums.reducer';
import { Doc, EnumStatusDoc, EnumTipoMovDoc, InfoDoc, Movimentacao } from '../models';
import { createInfoDoc, deleteInfoDoc, getInfoDocById, notifyEmailInfoDoc, updateInfoDoc } from '../reducers/infodoc.reducer';
import { cadastrarMovimentacao } from '../reducers/movimentacao.reducer';
import { LoadingButton } from '@mui/lab';
import { Storage } from 'react-jhipster';
import { toast } from 'react-toastify';
import { IUsuario } from '../../../shared/model/usuario.model';
import UploadInfoFile from '../ui/dialogs/upload-dialog/upload-files';
import { getResumeIaByToken, getTokenResumeIA } from '../reducers/anexo.reducer';

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

const getDocById = async (id: any) => {
  const { data } = await axios.get<Doc>(`services/all4qmsmsinfodoc/api/infodoc/documentos/${id}`);
  return data;
};

type resIAType = {
  Status: number;
  LLMResponse: string;
};
export const ValidationDocument = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id, idFile } = useParams();

  const [emitter, setEmitter] = useState('');
  const [emittedDate, setEmittedDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('externa');
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [noValidate, setNoValidate] = useState(false);
  const [validDate, setValidDate] = useState(new Date());
  const [documentDescription, setDocumentDescription] = useState('');
  const [notificationPreviousDate, setNotificationPreviousDate] = useState('0');
  const [originList, setOriginList] = useState([]);
  const [idNewFile, setIdNewFile] = useState<number>(-1);
  const [idOldFile, setIdOldFile] = useState<number>(-1);
  const [fileUploaded, SetFile] = useState<File>();
  const [timerGetIA, SetTimerGetIA] = useState<any>();

  const [keywordList, setKeywordList] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [loadingIA, setLoadingIA] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [isSGQ, setIsSGQ] = useState(false);
  const [currentUser, _] = useState(JSON.parse(Storage.session.get('USUARIO_QMS')));

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());
    dispatch(getInfoDocById(id!!));
    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        setSelectedProcess(data[0].id);
      }
    });

    const roles = Storage.local.get('ROLE');
    const isSGQ = ['ROLE_ADMIN', 'ROLE_SGQ'].some(item => roles.includes(item));
    setIsSGQ(isSGQ);
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

  const onNoValidateChanged = () => {
    if (noValidate) {
      setNoValidate(false);
      setValidDate(new Date());
    } else {
      setNoValidate(true);
      setValidDate(new Date(2999, 11, 31));
      setNotificationPreviousDate('0');
    }
  };

  const handleCloseRejectModal = () => {
    setOpenRejectModal(false);
  };

  const validateFields = () => {
    return emitter && emittedDate && documentDescription && code && title && selectedProcess;
  };

  const consultResumeIA = async tokenResumeIA => {
    const resResume = await dispatch(getResumeIaByToken({ token: tokenResumeIA }));
    const resumeIA: resIAType = (resResume.payload as AxiosResponse).data;

    // PROCESSING = 1,
    // PENDING = 2,
    // DONE = 3,
    // FAILED = 4,
    // DO_NOT_EXISTS = 5,
    // TOKEN_AND_FILENAME_MISSING = 6

    switch (resumeIA.Status) {
      case 1:
        return;
      case 2:
        return;
      case 3:
        clearInterval(timerGetIA);
        setDocumentDescription(resumeIA.LLMResponse);
        setLoadingIA(false);
        break;
      case 4:
        clearInterval(timerGetIA);
        setDocumentDescription('Não foi possivel carregar o documento automaticamente. Tente novamente mais tarde.');
        console.error('Erro ao carrecar IA resume: ', resumeIA.LLMResponse);
        setLoadingIA(false);
        break;
      case 5:
        clearInterval(timerGetIA);
        setDocumentDescription('Não foi possivel carregar o documento automaticamente. Tente novamente mais tarde.');
        console.error('Erro ao carrecar IA resume: ', resumeIA.LLMResponse);
        setLoadingIA(false);
        break;
      default:
        clearInterval(timerGetIA);
        setDocumentDescription('Não foi possivel carregar o documento automaticamente. Tente novamente mais tarde.');
        setLoadingIA(false);
        return;
    }
    // setLoadingIA(false);
    // console.log('resumeIA: ', tokenResumeIA);
  };
  const handleGetResume = async () => {
    try {
      if (!fileUploaded) {
        toast.warn('Não foi encontrado nem um documento revisado anexado, anexe-o antes e tente novamente.');
      }
      setLoadingIA(true);
      const resToken = await dispatch(getTokenResumeIA(fileUploaded));
      const tokenResumeIA = (resToken.payload as AxiosResponse).data;

      setDocumentDescription('Resumo da descrição do documento anexado, sendo gerado automaticamente, aguarde...');
      const _timerGetIA = setInterval(() => consultResumeIA(tokenResumeIA), 5000);
      SetTimerGetIA(_timerGetIA);
    } catch (err) {
      console.error('Error handleGetResume: ', err);
      clearInterval(timerGetIA);
      setLoadingIA(false);
    }
  };

  const onFileClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (actualInfoDoc) {
      const idFile = idOldFile > 0 ? idOldFile : actualInfoDoc.doc?.idArquivo;
      const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${idFile}`;

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
        });
    }
  };

  const cancelUpdate = () => {
    navigate('/infodoc');
  };

  const saveDoc = (): Doc => {
    const newInfoDoc: Doc = {
      ...actualInfoDoc.doc,
      idUsuarioCriacao: parseInt(emitter),
      dataCricao: emittedDate,
      descricaoDoc: description,
      justificativa: documentDescription,
      codigo: code,
      titulo: title,
      origem: origin,
      idArquivo: idNewFile > 0 ? idNewFile : actualInfoDoc.doc?.idArquivo,
      idProcesso: parseInt(selectedProcess),
      ignorarValidade: true,
      enumSituacao: 'R',
      tipoDoc: 'MA',
      revisao: actualInfoDoc.doc?.revisao ? actualInfoDoc.doc?.revisao + 1 : 1,
      idDocumentacaoAnterior: parseInt(id!!),
    };

    if (!noValidate) {
      newInfoDoc.ignorarValidade = false;
      newInfoDoc.dataValidade = validDate;
    }

    return newInfoDoc;
  };

  const saveDocument = () => {
    setIsLoading(true);
    const newInfoDoc = saveDoc();

    dispatch(updateInfoDoc({ data: newInfoDoc, id: newInfoDoc.id!! })).then((res: any) => {
      dispatch(getInfoDocById(id!!));
      setIsLoading(false);
    });
  };

  const users: IUsuario[] = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);
  const actualInfoDoc: InfoDoc = useAppSelector(state => state.all4qmsmsgateway.infodoc.entity);

  useEffect(() => {
    if (actualInfoDoc) {
      setCode(actualInfoDoc.doc?.codigo!!);
      setEmitter(actualInfoDoc.doc?.idUsuarioCriacao?.toString()!!);
      setEmittedDate(actualInfoDoc.doc?.dataCricao ? new Date(actualInfoDoc.doc?.dataCricao) : new Date());
      setDescription(actualInfoDoc.doc?.descricaoDoc!!);
      setDocumentDescription(actualInfoDoc.doc?.justificativa!!);
      setTitle(actualInfoDoc.doc?.titulo!!);
      setOrigin(actualInfoDoc.doc?.origem!!);
      setSelectedProcess(actualInfoDoc.doc?.idProcesso?.toString()!!);

      if (actualInfoDoc.doc?.dataValidade) {
        setNoValidate(false);
        setValidDate(new Date(actualInfoDoc.doc.dataValidade));
      } else {
        setNoValidate(true);
        setValidDate(new Date(2999, 11, 31));
        setNotificationPreviousDate('0');
      }
    }
  }, [actualInfoDoc]);

  const approveDocument = async () => {
    setIsLoading(true);
    await axios
      .put(`services/all4qmsmsinfodoc/api/infodoc/documentos/aprovacao-sgq/${id}`, {
        idDocumento: id,
        idUsuario: currentUser.id,
      })
      .then(async () => {
        toast.success('Documento enviado para aprovação!');
        const userEmitter: IUsuario = users.filter(usr => usr.id?.toString() == emitter)[0];
        dispatch(
          notifyEmailInfoDoc({
            to: userEmitter?.email || '', // Email
            subject: 'Documento requerendo APROVAÇãO',
            tipo: 'APROVAR',
            nomeEmissor: userEmitter?.nome || '', // nome
            tituloDocumento: 'Documento em APROVADO',
            dataCriacao: new Date(Date.now()).toLocaleDateString('pt-BR'),
            descricao: `Documento a ser aprovado por ${currentUser.firstName} ${currentUser.lastName} com o email ${currentUser.email}`,
            motivoReprovacao: '',
          })
        );
        navigate('/infodoc');
        setIsLoading(false);
      })
      .catch(e => {
        toast.error('Erro ao aprovar documento.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setOriginList(enums?.origem);

    if (enums?.origem.length > 0) {
      setOrigin(enums.origem[0].nome);
    }
  }, [enums]);

  return (
    <>
      <RejectDocumentDialog
        open={openRejectModal}
        handleClose={handleCloseRejectModal}
        currentUser={currentUser}
        currentDocument={actualInfoDoc}
        documentTitle="Documento M4-04-001 - Manual da Qualidade Tellescom Revisao - 04"
      ></RejectDocumentDialog>
      <UploadInfoFile
        open={openUploadFile}
        handleClose={() => setOpenUploadFile(false)}
        origin="edit"
        setIdNewFile={setIdNewFile}
        SetFile={SetFile}
      />
      <Box style={{ background: '#fff' }} className="ms-5 me-5 pb-5 mb-5">
        <Row className="justify-content-center mt-5">
          <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Informações documentadas
            </Link>
            <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Validação
            </Link>
            {/* <Typography style={{ color: '#606060' }}>Ficha de estoque</Typography> */}
          </Breadcrumbs>
        </Row>

        <div className="container-style mt-5 ms-3">
          <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl style={{ width: '30%' }}>
              <InputLabel>Emissor</InputLabel>
              <Select disabled={!isSGQ} label="Emissor" value={emitter} onChange={event => setEmitter(event.target.value)}>
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
                  Em validação
                </h3>
                <img src="../../../../content/images/icone-emissao.png" className="ms-2" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }} className="ms-2">
                <h3 className="p-0 m-0" style={{ fontSize: '15px' }}>
                  Situação:
                </h3>
                <h3 className="p-0 m-0 ms-2" style={{ fontSize: '15px', color: '#00000099' }}>
                  {actualInfoDoc?.doc?.revisao && actualInfoDoc?.doc?.revisao > 1 ? 'Revisão' : 'Edição'}
                </h3>
                <img src="../../../../content/images/icone-emissao.png" className="ms-2" />
              </div>

              <FormControl className="ms-2 mt-4">
                <DatePicker
                  selected={emittedDate}
                  onChange={date => setEmittedDate(date)}
                  className="date-picker"
                  dateFormat={'dd/MM/yyyy'}
                  disabled={!isSGQ}
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
              disabled={!isSGQ}
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
              <TextField
                label="Código"
                name="number"
                autoComplete="off"
                value={code}
                disabled={!isSGQ}
                onChange={e => setCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                sx={{ width: '100%' }}
                label="Título"
                name="number"
                autoComplete="off"
                value={title}
                disabled={!isSGQ}
                onChange={e => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Origem</InputLabel>
                <Select label="Origem" value={origin} disabled={!isSGQ} onChange={event => setOrigin(event.target.value)}>
                  {originList?.map((e: any) => (
                    <MenuItem value={e.nome}>{e.valor}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Área / Processo</InputLabel>
                <Select
                  label="Área / Processo"
                  value={selectedProcess}
                  disabled={!isSGQ}
                  onChange={event => setSelectedProcess(event.target.value)}
                >
                  {processes.map((process: any, i) => (
                    <MenuItem value={process.id} key={`process-${i}`}>
                      {process.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                style={{ backgroundColor: '#E0E0E0', color: '#4e4d4d', height: '55px' }}
                onClick={event => onFileClicked(event)}
              >
                <VisibilityIcon className="pe-1 pb-1" />
                Ver
              </Button>
            </Grid>
            <Grid item xs={1}>
              {isSGQ && (
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  style={{ backgroundColor: idNewFile > 0 ? '#e6b200' : '#E0E0E0', color: '#4e4d4d', height: '55px' }}
                  onClick={event => {
                    setIdOldFile(actualInfoDoc.doc?.idArquivo!!);
                    setOpenUploadFile(true);
                  }}
                >
                  <FileUploadRoundedIcon className="pe-1 pb-1" />
                  Novo
                </Button>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
            <FormControlLabel
              className="me-2"
              control={<Checkbox checked={noValidate} onClick={() => onNoValidateChanged()} />}
              label="Indeterminado"
              disabled={!isSGQ}
            />
            <FormControl className="me-2 ms-2 mt-4">
              <DatePicker
                selected={validDate}
                onChange={date => setValidDate(date)}
                className="date-picker"
                dateFormat={'dd/MM/yyyy'}
                disabled={!isSGQ || (isSGQ && noValidate)}
              />
              <label htmlFor="" className="rnc-date-label" style={{ width: '70px' }}>
                Validade
              </label>
            </FormControl>
            <FormControl sx={{ width: '15%' }} className="me-2 rnc-form-field ms-2">
              <InputLabel>Notificar antes de:</InputLabel>
              <Select
                style={{ height: '66px', boxShadow: 'inset 0 -1px 0 #ddd' }}
                label="Notificar antes de:"
                value={notificationPreviousDate}
                onChange={event => setNotificationPreviousDate(event.target.value)}
                disabled={!isSGQ || (isSGQ && noValidate)}
              >
                <MenuItem value="0">Não notificar</MenuItem>
                <MenuItem value="15d">15 dias antes</MenuItem>
                <MenuItem value="30d">30 dias antes</MenuItem>
                <MenuItem value="45d">45 dias antes</MenuItem>
                <MenuItem value="60d">60 dias antes</MenuItem>
              </Select>
            </FormControl>
            <LoadingButton
              variant="outlined"
              size="large"
              loading={loadingIA}
              sx={{ backgroundColor: '#0EBDCE', color: '#000', height: '60px' }}
              onClick={() => handleGetResume()}
            >
              Gerar Resumo IA documento
            </LoadingButton>
          </Box>
          <Textarea
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={documentDescription || ''}
            disabled={!isSGQ}
            onChange={e => setDocumentDescription(e.target.value)}
          />

          {/* <div className="mt-4">
            <TextField
              id="text-field-keyword"
              label="Escreva aqui..."
              style={{ width: '40%', maxWidth: '400px', minWidth: '200px' }}
              onChange={onKeywordChanged}
              value={keyword}
              disabled={!isSGQ}
            />
            <IconButton aria-label="Adicionar palavra chave" onClick={onKeywordAdded} disabled={!isSGQ}>
              <AddCircle fontSize="large" />
            </IconButton>
          </div>
          <div className="p-2 mt-3" style={{ width: '100%', border: '1px solid #c6c6c6', borderRadius: '4px', minHeight: '100px' }}>
            {keywordList.map((keyword: string, index: number) => (
              <Chip label={keyword} onDelete={event => onKeywordRemoved(event, index)} className="me-2" />
            ))}
          </div> */}

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button
              variant="contained"
              sx={{ backgroundColor: '#0EBDCE', color: '#4e4d4d', width: '100px' }}
              onClick={() => cancelUpdate()}
            >
              VOLTAR
            </Button>
            <Button
              className="ms-3"
              // disabled={!validateFields()}
              onClick={() => saveDocument()}
              sx={{ border: validateFields() ? '1px solid #000' : '', color: '#000', width: '100px' }}
            >
              SALVAR
            </Button>
            <Button
              className="ms-3"
              variant="contained"
              color="warning"
              sx={{ backgroundColor: '#A23900', color: '#fff', width: '100px' }}
              onClick={() => setOpenRejectModal(true)}
              disabled={!isSGQ}
            >
              Reprovar
            </Button>
            <Button
              className="ms-3"
              variant="contained"
              color="primary"
              onClick={() => approveDocument()}
              sx={{ backgroundColor: '#e6b200', color: '#4e4d4d', width: '100px' }}
              disabled={!isSGQ}
            >
              Aprovar
            </Button>
          </div>
        </div>
      </Box>
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

export default ValidationDocument;
