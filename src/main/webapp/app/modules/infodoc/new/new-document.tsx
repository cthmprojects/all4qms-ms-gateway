import {
  Breadcrumbs,
  Checkbox,
  Chip,
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
import { IUsuario } from 'app/shared/model/usuario.model';
import DatePicker from 'react-datepicker';
import { Textarea, styled } from '@mui/joy';
import { StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { AddCircle } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import downloadFile from '../infodoc-store';
import { listEnums } from '../reducers/enums.reducer';
import { createInfoDoc, deleteInfoDoc, getInfoDocById, updateInfoDoc } from '../reducers/infodoc.reducer';
import { InfoDoc, Doc, Movimentacao, EnumTipoMovDoc, EnumStatusDoc } from '../models';
import { downloadAnexo } from '../reducers/anexo.reducer';
import { atualizarMovimentacao, cadastrarMovimentacao } from '../reducers/movimentacao.reducer';
import { Storage } from 'react-jhipster';

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
  const [infoDocId, setInfoDocId] = useState(0);
  const [infoDocMovimentacao, setInfoDocMovimentacao] = useState(0);
  const [keywordList, setKeywordList] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());
    // dispatch(getInfoDocById(id));

    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        setSelectedProcess(data[0].id);
      }
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

  const onFileClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
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

          const file = new Blob([result.data], { type: 'application/octet-stream' });

          fileDownload(file, `${fileName}.pdf`);
        });
    }
  };

  const cancelDocument = () => {
    dispatch(deleteInfoDoc(id));
    navigate('/infodoc');
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

  const validateFields = () => {
    return emitter && emittedDate && documentDescription && code && title && selectedProcess;
  };

  const saveDocument = () => {
    const newInfoDoc: Doc = {
      idUsuarioCriacao: parseInt(emitter),
      dataCricao: emittedDate,
      descricaoDoc: description,
      justificativa: documentDescription,
      codigo: code,
      titulo: title,
      origem: 'I',
      idProcesso: parseInt(selectedProcess),
      idArquivo: parseInt(id),
      ignorarValidade: true,
      enumSituacao: 'E',
      tipoDoc: 'MA',
    };

    if (!noValidate) {
      newInfoDoc.ignorarValidade = false;
      newInfoDoc.dataValidade = validDate;
    }

    dispatch(createInfoDoc(newInfoDoc)).then((res: any) => {
      setInfoDocId(parseInt(res.payload.data?.doc?.id));
      setInfoDocMovimentacao(parseInt(res.payload.data?.movimentacao?.id));
    });
  };

  const fowardDocument = () => {
    const novaMovimentacao: Movimentacao = {
      id: infoDocMovimentacao,
      enumTipoMovDoc: EnumTipoMovDoc.EMITIR,
      enumStatus: EnumStatusDoc.VALIDACAO,
      idDocumentacao: infoDocId,
      idUsuarioCriacao: currentUser.id,
    };

    dispatch(atualizarMovimentacao(novaMovimentacao));
  };

  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);

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
                  em emissão
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
          <div className="mt-4">
            <TextField
              label="Código"
              name="number"
              className="m-2 ms-0"
              autoComplete="off"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <TextField
              sx={{ width: '30%' }}
              label="Título"
              name="number"
              className="m-2"
              autoComplete="off"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <FormControl sx={{ width: '15%' }} className="m-2">
              <InputLabel>Origem</InputLabel>
              <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)}>
                {originList?.map(e => (
                  <MenuItem value={e.nome}>{e.valor}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '25%' }} className="m-2 me-3">
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
              className="m-2 ms-0"
              variant="outlined"
              size="large"
              onClick={event => onFileClicked(event)}
              style={{ backgroundColor: '#E0E0E0', height: '55px' }}
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
            />
            <FormControl className="me-2 ms-2 mt-4">
              <DatePicker
                selected={validDate}
                onChange={date => setValidDate(date)}
                className="date-picker"
                dateFormat={'dd/MM/yyyy'}
                disabled={noValidate}
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
                disabled={noValidate}
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

          <div className="mt-4">
            <TextField
              id="text-field-keyword"
              label="Documentos relacionados"
              style={{ width: '40%', maxWidth: '400px', minWidth: '200px' }}
              onChange={onKeywordChanged}
              value={keyword}
            />
            <IconButton aria-label="Adicionar palavra chave" onClick={onKeywordAdded}>
              <AddCircle fontSize="large" />
            </IconButton>
          </div>
          <div className="p-2 mt-3" style={{ width: '100%', border: '1px solid #c6c6c6', borderRadius: '4px', minHeight: '100px' }}>
            {keywordList.map((keyword: string, index: number) => (
              <Chip label={keyword} onDelete={event => onKeywordRemoved(event, index)} className="me-2" />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => cancelDocument()}
            >
              Voltar
            </Button>
            <Button disabled={!validateFields()} onClick={() => saveDocument()}>
              Salvar
            </Button>
            <Button
              disabled={infoDocId <= 0}
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
    </>
  );
};

export default NewDocument;
