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
import UploadInfoFile from '../ui/dialogs/upload-dialog/upload-files';
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
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

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

  // Novos estados para gerenciamento de arquivo
  const [fileId, setFileId] = useState<number | null>(() => {
    // Prioridade: ID da URL > localStorage > null
    if (id) return parseInt(id);
    const savedFileId = localStorage.getItem('infodoc_temp_fileId');
    return savedFileId ? parseInt(savedFileId) : null;
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(() => {
    const savedFileName = localStorage.getItem('infodoc_temp_fileName');
    return savedFileName ? new File([], savedFileName) : null;
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string>('');

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
    const fileIdToUse = fileId || (id ? parseInt(id) : null);

    if (fileIdToUse) {
      const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${fileIdToUse}/original`;

      try {
        const result = await axios.request({
          responseType: 'arraybuffer',
          url: downloadUrl,
          method: 'get',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });

        var fileDownload = require('js-file-download');
        let fileName = result.headers['content-disposition'].split(';')[1];
        fileName = fileName.split('=')[1];
        fileName = fileName.split('_').slice(5).join('_');

        const file = new Blob([result.data], { type: 'application/octet-stream' });
        fileDownload(file, `${fileName}`);
      } catch (error) {
        console.error('Erro ao baixar arquivo:', error);
        toast.error('Erro ao baixar arquivo. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Nenhum arquivo disponível para download');
      setIsLoading(false);
    }
  };

  // Função para verificar se o usuário tem acesso ADMIN ou SGQ
  // Usando a mesma lógica do infodoc-list.tsx
  const hasAdminOrSGQAccess = () => {
    return hasAnyAuthority(account?.authorities, [AUTHORITIES.ADMIN, AUTHORITIES.SGQ]);
  };

  // Funções de controle de permissão para campos
  const isEmitterFieldEnabled = () => {
    return hasAdminOrSGQAccess();
  };

  const isCodeFieldEnabled = () => {
    return hasAdminOrSGQAccess();
  };

  const isTitleFieldEnabled = () => {
    return hasAdminOrSGQAccess();
  };

  const isValidityFieldEnabled = () => {
    return hasAdminOrSGQAccess();
  };

  const isNotificationFieldEnabled = () => {
    return hasAdminOrSGQAccess();
  };

  const isDescriptionFieldEnabled = () => {
    return hasAdminOrSGQAccess();
  };

  const isKeywordsFieldEnabled = () => {
    return hasAdminOrSGQAccess();
  };

  // Campos sempre habilitados (independente do perfil)
  const isJustificationFieldEnabled = () => {
    return true; // Sempre habilitado
  };

  const isDateFieldEnabled = () => {
    return true; // Sempre habilitado
  };

  const isOriginFieldEnabled = () => {
    return true; // Sempre habilitado
  };

  const isProcessFieldEnabled = () => {
    return true; // Sempre habilitado
  };

  // Funções para gerenciamento de arquivo
  const hasValidFile = () => {
    return fileId && fileId > 0;
  };

  const validateAllFields = () => {
    return emitter && emittedDate && selectedProcess && description && hasValidFile();
  };

  const getSaveButtonState = () => {
    if (!hasValidFile()) {
      return { disabled: true, text: 'Salvar (Arquivo obrigatório)' };
    }
    if (!validateFields()) {
      return { disabled: true, text: 'Salvar (Campos obrigatórios)' };
    }
    return { disabled: false, text: 'Salvar' };
  };

  const getForwardButtonState = () => {
    if (!hasValidFile()) {
      return { disabled: true, text: 'Encaminhar (Arquivo obrigatório)' };
    }
    if (!validateFields()) {
      return { disabled: true, text: 'Encaminhar (Campos obrigatórios)' };
    }
    return { disabled: false, text: 'Encaminhar' };
  };

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
  };

  const handleFileUploaded = (newFileId: number, file: File) => {
    setFileId(newFileId);
    setUploadedFile(file);
    setFileUploadError('');
    setUploadModalOpen(false);

    // Salvar no localStorage para persistência
    localStorage.setItem('infodoc_temp_fileId', newFileId.toString());
    localStorage.setItem('infodoc_temp_fileName', file.name);
  };

  const goBackToList = () => {
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
    // Validação de arquivo obrigatório
    if (!hasValidFile()) {
      toast.error('Arquivo é obrigatório para salvar o documento');
      return null;
    }

    setIsLoading(true);
    try {
      const newInfoDoc: Doc = {
        idUsuarioCriacao: parseInt(emitter),
        dataCricao: emittedDate,
        descricaoDoc: description,
        justificativa: documentDescription, // ✅ CORREÇÃO: Usar valor preenchido pelo usuário
        codigo: code, // ✅ CORREÇÃO: Usar valor preenchido pelo usuário
        titulo: title, // ✅ CORREÇÃO: Usar valor preenchido pelo usuário
        origem: origin, // ✅ CORREÇÃO: Usar valor selecionado pelo usuário
        idProcesso: parseInt(selectedProcess),
        idArquivo: fileId,
        ignorarValidade: true,
        enumSituacao: EnumSituacao.EDICAO,
        tipoDoc: 'MA',
        // revisao: 0,
      };

      if (!noValidate) {
        newInfoDoc.ignorarValidade = false;
        newInfoDoc.dataValidade = validDate;
        newInfoDoc.idPrazo = parseInt(notificationPreviousDate); // ✅ CORREÇÃO: Salvar período de notificação
      } else {
        newInfoDoc.idPrazo = 0; // Não notificar quando indeterminado
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

        // Limpar dados temporários do localStorage
        localStorage.removeItem('infodoc_temp_fileId');
        localStorage.removeItem('infodoc_temp_fileName');

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
        idDocumentacao: resDoc.doc.id!!,
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
  const account = useAppSelector(state => state.authentication.account);

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
              <Select
                label="Emissor"
                value={emitter}
                onChange={event => setEmitter(event.target.value)}
                disabled={!isEmitterFieldEnabled()}
              >
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
                {/* <img src="../../../../content/images/icone-emissao.png" className="ms-2" /> */}
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }} className="ms-2">
                <h3 className="p-0 m-0" style={{ fontSize: '15px' }}>
                  Situação:
                </h3>
                <h3 className="p-0 m-0 ms-2" style={{ fontSize: '15px', color: '#00000099' }}>
                  Edição
                </h3>
                {/* <img src="../../../../content/images/icone-emissao.png" className="ms-2" /> */}
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

          {/* Seção de Arquivo - Posição Discreta */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              px: 2,
              backgroundColor: '#f8f9fa',
              borderRadius: 1,
              border: '1px solid #e9ecef',
              mt: 2,
            }}
          >
            <AttachFileIcon color={fileId ? 'success' : 'disabled'} />
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
              {fileId ? `Arquivo: ${uploadedFile?.name || `ID ${fileId}`}` : 'Nenhum arquivo selecionado'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenUploadModal}
              sx={{
                color: '#e6b200',
                borderColor: '#e6b200',
                '&:hover': {
                  borderColor: '#d4a500',
                  backgroundColor: '#fff8e1',
                },
              }}
            >
              {fileId ? 'Alterar' : 'Adicionar'}
            </Button>
            {!fileId && (
              <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                Obrigatório
              </Typography>
            )}
          </Box>

          {fileUploadError && (
            <Typography variant="body2" color="error" sx={{ mt: 1, ml: 2 }}>
              {fileUploadError}
            </Typography>
          )}

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
                disabled={!isCodeFieldEnabled()}
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
                disabled={!isTitleFieldEnabled()}
                onChange={e => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Origem</InputLabel>
                <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)} disabled={!isOriginFieldEnabled()}>
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
                <Select
                  label="Área / Processo"
                  value={selectedProcess}
                  onChange={event => setSelectedProcess(event.target.value)}
                  disabled={!isProcessFieldEnabled()}
                >
                  {processes.map((process: any, i) => (
                    <MenuItem value={process.id} key={`process-${i}`}>
                      {process.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              {infoDocId > 0 && (
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
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
            <FormControlLabel
              className="me-2"
              control={<Checkbox checked={noValidate} onClick={() => onNoValidateChanged()} />}
              label="Indeterminado"
              disabled={!isValidityFieldEnabled()}
            />
            <FormControl style={{ height: '60px', width: '190px' }} disabled={!isValidityFieldEnabled()}>
              <DatePicker
                selected={validDate}
                onChange={date => setValidDate(date)}
                className="date-picker"
                dateFormat={'dd/MM/yyyy'}
                disabled={!isValidityFieldEnabled() || (isValidityFieldEnabled() && noValidate)}
              />
              <label htmlFor="" className="rnc-date-label" style={{ width: '70px' }}>
                Validade
              </label>
            </FormControl>
            <FormControl style={{ height: '60px', width: '190px' }} disabled={!isNotificationFieldEnabled()}>
              <InputLabel>Notificar antes de:</InputLabel>
              <Select
                disabled={!isNotificationFieldEnabled() || (isNotificationFieldEnabled() && noValidate)}
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
            disabled={!isDescriptionFieldEnabled()}
          />

          {/* <div className="mt-4">
            <TextField
              id="text-field-keyword"
              label="Documentos relacionados"
              style={{ width: '40%', maxWidth: '400px', minWidth: '200px' }}
              onChange={onKeywordChanged}
              value={keyword}
              disabled={!isKeywordsFieldEnabled()}
            />
            <IconButton aria-label="Adicionar palavra chave" onClick={onKeywordAdded} disabled={!isKeywordsFieldEnabled()}>
              <AddCircle fontSize="large" />
            </IconButton>
          </div>
          <div className="p-2 mt-3" style={{ width: '100%', border: '1px solid #c6c6c6', borderRadius: '4px', minHeight: '100px' }}>
            {keywordList.map((keyword: string, index: number) => (
              <Chip key={index} label={keyword} onDelete={event => onKeywordRemoved(event, index)} className="me-2" />
            ))}
          </div> */}

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => goBackToList()}>
              Voltar
            </Button>
            <Button
              onClick={() => saveDocument()}
              disabled={getSaveButtonState().disabled}
              style={{
                backgroundColor: getSaveButtonState().disabled ? '#ccc' : '#e6b200',
                color: '#4e4d4d',
              }}
            >
              {getSaveButtonState().text}
            </Button>
            <Button
              onClick={() => fowardDocument()}
              className="ms-3"
              variant="contained"
              disabled={getForwardButtonState().disabled}
              style={{
                backgroundColor: getForwardButtonState().disabled ? '#ccc' : '#e6b200',
                color: '#4e4d4d',
              }}
            >
              {getForwardButtonState().text}
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

      {/* Modal de Upload */}
      <UploadInfoFile
        open={uploadModalOpen}
        handleClose={() => setUploadModalOpen(false)}
        onFileUploaded={(fileId: number, file: File) => handleFileUploaded(fileId, file)}
        origin="new"
      />
    </>
  );
};

export default NewDocument;
