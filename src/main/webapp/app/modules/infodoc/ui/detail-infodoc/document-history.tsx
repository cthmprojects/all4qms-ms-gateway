/* eslint-disable no-console */
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Textarea, styled } from '@mui/joy';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import axios from 'axios';
import fileDownload from 'js-file-download';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Storage } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserQMS } from '../../../../entities/usuario/reducers/usuario.reducer';
import { InfoDoc, Process } from '../../models';
import { listEnums } from '../../reducers/enums.reducer';
import { getDocumentRevisions } from '../../reducers/infodoc.reducer';

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

export const DocumentHistory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { codigo } = useParams();

  const [processes, setProcesses] = useState<Process[]>([]);
  const [currentUser] = useState<UserQMS>(JSON.parse(Storage.session.get('USUARIO_QMS')));

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());
    if (codigo) {
      dispatch(getDocumentRevisions(codigo));
    }
    getProcesses().then(data => {
      setProcesses(data);
    });
  }, [codigo]);

  const handleBack = () => {
    navigate('/infodoc', { state: { selectedTab: 'HOMOLOGADOS' } });
  };

  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);
  const revisions: InfoDoc[] = useAppSelector(state => state.all4qmsmsgateway.infodoc.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.infodoc.loading);

  const filterUser = (id: number) => {
    if (!users || users.length <= 0) {
      return '-';
    }

    if (id) {
      return users.find(user => user.id === id)?.nome || '-';
    }

    return '-';
  };

  const filterProcessName = (id: number) => {
    if (!processes || processes.length <= 0) {
      return '-';
    }

    if (id) {
      return processes.find(process => process.id === id)?.nome || '-';
    }

    return '-';
  };

  const filterOrigin = (type: string) => {
    if (!enums || !enums.origem || enums.origem.length <= 0) {
      return '-';
    }

    if (type) {
      return (enums.origem.find(o => o.nome === type)?.valor || '-').toUpperCase();
    }

    return '-';
  };

  const handleFileClick = async (idArquivo: number) => {
    if (!idArquivo) return;

    const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${idArquivo}/original`;

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
  };

  const renderRevisionCard = (revision: InfoDoc, index: number) => {
    const doc = revision.doc;
    const emittedDate = new Date(doc.dataCricao);
    const validDate = doc.ignorarValidade ? null : new Date(doc.dataValidade);

    return (
      <Card key={doc.id} sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardHeader
          title={`Revisão ${doc.revisao || 0}`}
          subheader={`Data: ${emittedDate.toLocaleDateString('pt-BR')}`}
          sx={{
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0',
          }}
        />
        <CardContent>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <FormControl style={{ width: '30%' }}>
                <InputLabel>Emissor</InputLabel>
                <Select value={doc.idUsuarioCriacao || ''} label="Emissor" readOnly>
                  {users?.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className="ms-2 mt-4">
                <DatePicker selected={emittedDate} onChange={() => {}} className="date-picker" dateFormat={'dd/MM/yyyy'} readOnly />
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
              value={doc.justificativa || ''}
              readOnly
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
              <TextField label="Código" name="number" autoComplete="off" value={doc.codigo} disabled onChange={() => {}} />
            </Grid>
            <Grid item xs>
              <TextField
                sx={{ width: '100%' }}
                label="Título"
                name="number"
                autoComplete="off"
                value={doc.titulo}
                disabled
                onChange={() => {}}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }} disabled>
                <InputLabel>Origem</InputLabel>
                <Select label="Origem" value={doc.origem} onChange={() => {}}>
                  {enums?.origem?.map((e: any, idx) => (
                    <MenuItem key={idx} value={e.nome}>
                      {e.valor.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl style={{ width: '100%' }} disabled>
                <InputLabel>Área / Processo</InputLabel>
                <Select label="Área / Processo" value={doc.idProcesso || ''} onChange={() => {}}>
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
                onClick={() => handleFileClick(doc.idArquivo)}
                disabled={!doc.idArquivo}
              >
                <AttachFileIcon className="pe-1 pb-1" />
                Arquivo
              </Button>
            </Grid>
          </Grid>
          <div className="mt-4" style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              className="me-2"
              control={<Checkbox checked={doc.ignorarValidade} onClick={() => {}} />}
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
                value={doc.idPrazo?.toString() || '0'}
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
            value={doc.descricaoDoc || ''}
            disabled
            onChange={() => {}}
          />
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="padding-container">
        <div className="container-style">
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Carregando histórico de revisões...
          </Typography>
        </div>
      </div>
    );
  }

  if (!revisions || revisions.length === 0) {
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
            <Typography className="link">Histórico de Revisões</Typography>
          </Breadcrumbs>

          <h1 className="title">Histórico de Revisões</h1>

          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Nenhuma revisão encontrada para o código: {codigo}
          </Typography>

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px', justifyItems: 'right' }} className="mt-5">
            <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={handleBack}>
              VOLTAR
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <Typography className="link">Histórico de Revisões</Typography>
        </Breadcrumbs>

        <h1 className="title">Histórico de Revisões - {codigo}</h1>

        <div>
          {revisions.map((revision, index) => renderRevisionCard(revision, index))}

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

export default DocumentHistory;
