/* eslint-disable no-console */
import {
  Box,
  Breadcrumbs,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
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
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import DatePicker from 'react-datepicker';
import { Textarea, styled } from '@mui/joy';
import { StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import { AddCircle, Download, UploadFile } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios, { AxiosResponse } from 'axios';
import { RejectDocumentDialog } from '../ui/dialogs/reject-document-dialog/reject-document-dialog';
import { listEnums } from '../reducers/enums.reducer';
import { Doc, EnumStatusDoc, EnumTipoMovDoc, InfoDoc, Movimentacao } from '../models';
import { createInfoDoc, deleteInfoDoc, getInfoDocById, updateInfoDoc } from '../reducers/infodoc.reducer';
import { atualizarMovimentacao, cadastrarMovimentacao } from '../reducers/movimentacao.reducer';
import { Storage } from 'react-jhipster';
import { toast } from 'react-toastify';

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

export const UpdateDocument = () => {
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
  const [idNewFile, setIdNewFile] = useState<number>();

  const [keywordList, setKeywordList] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [currentUser, _] = useState(JSON.parse(Storage.session.get('USUARIO_QMS')));
  const [isSGQ, setIsSGQ] = useState<Boolean>(false);
  const [infoDocId, setInfoDocId] = useState(0);
  const [infoDocMovimentacao, setInfoDocMovimentacao] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [openRejectModal, setOpenRejectModal] = useState(false);

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
    return emitter && emittedDate && title && selectedProcess;
  };

  const onFileClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    if (actualInfoDoc) {
      const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${idFile ? idFile : actualInfoDoc.doc.idArquivo}`;

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
      setIsLoading(false);
    }
  };

  const saveDoc = (): Doc => {
    const newInfoDoc: Doc = {
      id: parseInt(id!!),
      idUsuarioCriacao: parseInt(emitter),
      dataCricao: emittedDate,
      descricaoDoc: description,
      justificativa: documentDescription,
      codigo: code,
      titulo: title,
      origem: origin,
      idArquivo: parseInt(idFile!!),
      idProcesso: parseInt(selectedProcess),
      ignorarValidade: true,
      enumSituacao: 'R',
      tipoDoc: 'MA',
      // revisao: actualInfoDoc.doc?.revisao ? parseInt(actualInfoDoc.doc?.revisao) + 1 : 1,
      idDocumentacaoAnterior: parseInt(id!!),
    };

    if (!noValidate) {
      newInfoDoc.ignorarValidade = false;
      newInfoDoc.dataValidade = validDate;
    }

    return newInfoDoc;
  };

  const saveDocument = async () => {
    setIsLoading(true);
    const newInfoDoc = saveDoc();

    const resStoreDoc = await dispatch(updateInfoDoc({ data: newInfoDoc, id: newInfoDoc.id!! }));

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
  };

  const fowardDocument = async () => {
    if (!validateFields()) {
      toast.warn(`Os campos de Emissor, Área/Proceso, Descrição, Código e Titulo , SÃO OBRIGATÓRIOS!`);
      return null;
    }

    const resDoc = await saveDocument();

    if (resDoc) {
      const novaMovimentacao: Movimentacao = {
        id: infoDocMovimentacao,
        enumTipoMovDoc: EnumTipoMovDoc.REVISAR,
        enumStatus: EnumStatusDoc.VALIDAREV,
        idDocumentacao: infoDocId,
        idUsuarioCriacao: currentUser.id,
      };

      dispatch(atualizarMovimentacao(novaMovimentacao));
      navigate('/infodoc');
    } else {
      toast.error(`Não foi possivel salvar Documento, tente novamente mais tarde!`);
      setIsLoading(false);
      return null;
    }
  };

  const cancelUpdate = () => {
    navigate('/infodoc');
  };

  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);
  const actualInfoDoc = useAppSelector(state => state.all4qmsmsgateway.infodoc.entity);

  useEffect(() => {
    if (actualInfoDoc) {
      setCode(actualInfoDoc.doc?.codigo);
      setEmitter(actualInfoDoc.doc?.idUsuarioCriacao);
      setEmittedDate(actualInfoDoc.doc?.dataCricao ? new Date(actualInfoDoc.doc?.dataCricao) : new Date());
      setDescription(actualInfoDoc.doc?.descricaoDoc);
      setDocumentDescription(actualInfoDoc.doc?.justificativa);
      setTitle(actualInfoDoc.doc?.titulo);
      setOrigin(actualInfoDoc.doc?.origem);
      setSelectedProcess(actualInfoDoc.doc?.idProcesso);
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

  useEffect(() => {
    if (users && actualInfoDoc) {
      setEmitter(actualInfoDoc.doc?.idUsuarioCriacao);
    }
  }, [users]);

  useEffect(() => {
    setOriginList(enums?.origem);

    if (enums?.origem.length > 0) {
      setOrigin(enums.origem[0].nome);
    }
  }, [enums]);

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
              Revisar
            </Link>
            {/* <Typography style={{ color: '#606060' }}>Ficha de estoque</Typography> */}
          </Breadcrumbs>
        </Row>

        <div className="container-style mt-5 ms-3">
          <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl style={{ width: '30%' }}>
              <InputLabel>Emissor</InputLabel>
              <Select disabled label="Emissor" value={emitter} onChange={event => setEmitter(event.target.value)}>
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
                  Em Revisão
                </h3>
                <img src="../../../../content/images/icone-emissao.png" className="ms-2" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }} className="ms-2">
                <h3 className="p-0 m-0" style={{ fontSize: '15px' }}>
                  Situação:
                </h3>
                <h3 className="p-0 m-0 ms-2" style={{ fontSize: '15px', color: '#00000099' }}>
                  Revisão
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
          <div className="mt-4">
            <TextField
              label="Código"
              name="number"
              className="me-2"
              autoComplete="off"
              value={code}
              disabled
              onChange={e => setCode(e.target.value)}
            />
            <TextField
              sx={{ width: '30%' }}
              label="Título"
              name="number"
              className="me-2 ms-2"
              autoComplete="off"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <FormControl sx={{ width: '15%' }} className="me-2 ms-2">
              <InputLabel>Origem</InputLabel>
              <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)}>
                {originList?.map(e => (
                  <MenuItem value={e.nome}>{e.valor}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '22%' }} className="me-2 ms-2">
              <InputLabel>Área / Processo</InputLabel>
              <Select label="Área / Processo" value={selectedProcess} onChange={event => setSelectedProcess(event.target.value)}>
                {processes.map((process, i) => (
                  <MenuItem value={process.id} key={`process-${i}`}>
                    {process.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              className="ms-2"
              variant="outlined"
              size="large"
              style={{ backgroundColor: idNewFile ? '#e6b200' : '#E0E0E0', color: '#4e4d4d', height: '55px' }}
              onClick={event => onFileClicked(event)}
            >
              <VisibilityIcon className="pe-1 pb-1" />
              Arquivo
            </Button>
          </div>
          <div className="mt-4" style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              className="me-2"
              control={<Checkbox checked={noValidate} onClick={() => onNoValidateChanged()} />}
              label="Indeterminado"
              disabled
            />
            <FormControl className="me-2 ms-2 mt-4">
              <DatePicker
                selected={validDate}
                onChange={date => setValidDate(date)}
                className="date-picker"
                dateFormat={'dd/MM/yyyy'}
                disabled
              />
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
                onChange={event => setNotificationPreviousDate(event.target.value)}
                disabled
              >
                <MenuItem value="0">Não notificar</MenuItem>
                <MenuItem value="15d">15 dias antes</MenuItem>
                <MenuItem value="30d">30 dias antes</MenuItem>
                <MenuItem value="45d">45 dias antes</MenuItem>
                <MenuItem value="60d">60 dias antes</MenuItem>
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
            onChange={e => setDocumentDescription(e.target.value)}
          />

          {/* <div className="mt-4">
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
            {keywordList.map((keyword: string, index: number) => (
              <Chip label={keyword} onDelete={event => onKeywordRemoved(event, index)} className="me-2" />
            ))}
          </div> */}

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => cancelUpdate()}>
              VOLTAR
            </Button>
            <Button onClick={() => saveDocument()}>SALVAR</Button>
            <Button
              disabled={infoDocId <= 0}
              className="ms-3"
              variant="contained"
              color="primary"
              onClick={() => fowardDocument()}
              style={{ background: '#e6b200', color: '#4e4d4d' }}
            >
              ENCAMINHAR
            </Button>
            {/* <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => navigate('/infodoc')}
            >
              Voltar
            </Button>
            <Button>Salvar</Button>
            <Button
              className="ms-3"
              variant="contained"
              color="primary"
              style={{ background: '#A23900', color: '#fff' }}
              onClick={() => setOpenRejectModal(true)}
            >
              Reprovar
            </Button>
            <Button className="ms-3" variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
              Aprovar
            </Button> */}
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

export default UpdateDocument;
