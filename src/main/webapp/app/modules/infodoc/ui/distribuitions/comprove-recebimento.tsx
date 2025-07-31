import { Textarea, styled } from '@mui/joy';
import { Box, Breadcrumbs, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { UserQMS, getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
// import downloadFile from '../infodoc-store';
import { AUTHORITIES } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { Storage } from 'react-jhipster';
import { toast } from 'react-toastify';
import { getUsersByProcess } from '../../../../entities/usuario/reducers/usuario.reducer';
import { getUsersAsGQ } from '../../../../entities/usuario/usuario.reducer';
import { InfoDoc } from '../../models';
import { DetalheDistribuicao, DistribuicaoCompleta } from '../../models/distribuicao';
import { atualizarDetailDistribuicao, buscarDetailDistribuicao } from '../../reducers/distribuicao.reducer';
import { getInfoDocById } from '../../reducers/infodoc.reducer';
import { TabIdentifier } from '../../ui/home/tab-identifier';

const StyledLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  top: 'calc((var(--Textarea-minHeight) - 1em) / 2)',
  color: theme.vars.palette.text.tertiary,
  fontWeight: 400,
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const JustifyFalta = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Comentário de Entrega</StyledLabel>
    </React.Fragment>
  );
});

const justifyDevolution = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Comentário de Recebimento</StyledLabel>
    </React.Fragment>
  );
});

const getProcesses = async () => {
  const apiUrl = 'services/all4qmsmsgateway/api/processos';
  const response = await axios.get(`${apiUrl}`);
  return response.data;
};

export const ComproveRecebimento = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as { from?: string; isControlled?: boolean } & DistribuicaoCompleta;
  const distribuicao = state;
  const isFromDistribution = state?.from === 'distribution';
  const isControlled = state?.isControlled;
  const account = useAppSelector(state => state.authentication.account);

  const [idProcesso, setIdProcesso] = useState<number>(-1);
  const [idUsuarioEntrega, setIdUsuarioEntrega] = useState<number>(-1);
  const [idUsuarioDevolucao, setIdUsuarioDevolucao] = useState<number>(-1);
  const [TipoControleDoc, setTipoControleDoc] = useState<string>('');
  const [codigo, setCodigo] = useState<string>('');
  const [titulo, setTitulo] = useState<string>('');
  const [recebidoPor, setRecebidoPor] = useState<string>('');
  const [dataEntrega, setDataEntrega] = useState<Date | null>(new Date());
  const [devolvidoPor, setDevolvidoPor] = useState<string>('');
  const [dataDevolucao, setDataDevolucao] = useState<Date | null>(new Date());
  const [comentarioEntrega, setComentarioEntrega] = useState<string>('');
  const [comentarioDevolucao, setComentarioDevolucao] = useState<string>('');

  const [isJustify, setIsJustify] = useState(false);
  const [isRecebido, setIsRecebido] = useState(false);
  const [isDevolvido, setIsDevolvido] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [currentUser, _] = useState(JSON.parse(Storage.session.get('USUARIO_QMS')));
  const [usersSGQ, setUsersSGQ] = useState<UserQMS[]>([]);
  const [infoDocId, setInfoDocId] = useState(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const distribuition: DetalheDistribuicao = useAppSelector(state => state.all4qmsmsgateway.distribuicao.entity);

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(buscarDetailDistribuicao(Number(id)));

    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        setIdProcesso(data[0].id);
        getUsersSGQ(data[0].id);
      }
    });
  }, []);

  const requestDoc = async () => {
    const resDoc = await dispatch(getInfoDocById(distribuicao.idDocumentacao));
    const infoDoc = resDoc.payload as InfoDoc;

    setTipoControleDoc(infoDoc.doc.tipoDoc ?? '');
  };

  useEffect(() => {
    if (distribuition) {
      requestDoc();
      setIdUsuarioEntrega(distribuicao.idUsuarioEntrega ?? -1);
      setIdProcesso(distribuicao.idProcesso ?? -1);

      setCodigo(distribuicao.codigo ?? '');
      setTitulo(distribuicao.titulo ?? '');
      setDataEntrega(distribuition.dataEntrega ? new Date(distribuition.dataEntrega) : null);
      setDataDevolucao(distribuition.dataDevolucao ? new Date(distribuition.dataDevolucao) : null);
      setComentarioEntrega(distribuition.comentarioEntrega ?? '');
      setComentarioDevolucao(distribuition.comentarioDevolucao ?? '');
      setIdUsuarioDevolucao(distribuition.idUsuarioDevolucao ?? -1);
      setIsRecebido(!!distribuition.idUsuarioEntrega);
      setIsDevolvido(!!distribuition.comentarioDevolucao?.trim());
      setIsJustify(!!distribuition.comentarioEntrega?.trim());

      // Carregar usuários filtrados pelo processo da distribuição
      if (distribuicao.idProcesso) {
        filterUsersByProcess(distribuicao.idProcesso);
      }
    }
  }, [distribuition]);

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

  // Função para filtrar usuários por processo
  const filterUsersByProcess = async (processId: number) => {
    if (processId > 0) {
      try {
        const resUsersByProcess = await dispatch(getUsersByProcess(processId));
        const usersByProcess = (resUsersByProcess.payload as AxiosResponse).data || [];
        setFilteredUsers(usersByProcess);
      } catch (error) {
        console.error('Erro ao buscar usuários por processo:', error);
        setFilteredUsers([]);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  // Atualizar usuários filtrados quando o processo mudar
  useEffect(() => {
    if (idProcesso > 0) {
      filterUsersByProcess(idProcesso);
    }
  }, [idProcesso]);

  const cancelDocument = () => {
    if (isFromDistribution) {
      navigate('/infodoc', { state: { selectedTab: TabIdentifier.DISTRIBUICAO } }); // Alterado para TabIdentifier
    } else {
      navigate('/infodoc', { state: { selectedTab: TabIdentifier.COPIA_CONTROLADA } }); // Alterado para TabIdentifier
    }
  };

  const saveDocument = async () => {
    setIsLoading(true);
    try {
      const distri: DetalheDistribuicao = {
        id: distribuicao.idDistribuicaoDoc,
        idDistribuicaoDoc: distribuicao.idDistribuicaoDoc,
        idUsuarioEntrega: idUsuarioEntrega < 0 ? distribuicao.idUsuarioEntrega : idUsuarioEntrega,
        dataEntrega,
        comentarioEntrega,
        idUsuarioDevolucao: idUsuarioDevolucao < 0 ? distribuicao.idUsuarioDevolucao : idUsuarioDevolucao,
        dataDevolucao,
        comentarioDevolucao,
      };

      const resStoreDist = await dispatch(atualizarDetailDistribuicao(distri));

      const resDist: DetalheDistribuicao = (resStoreDist.payload as AxiosResponse).data || {};
      if (resDist) {
        setIsLoading(false);
        toast.success(`Distribuição recebida com sucesso!`);

        if (isFromDistribution) {
          navigate('/infodoc', { state: { selectedTab: TabIdentifier.DISTRIBUICAO } }); // Tab de Distribuição
        } else {
          navigate('/infodoc', { state: { selectedTab: TabIdentifier.COPIA_CONTROLADA } }); // Tab de Cópia Controlada
        }
        return resDist;
      } else {
        toast.error(`Não foi possivel receber distribuição de Documento, tente novamente mais tarde!`);
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

  // Função para determinar se um campo deve estar desabilitado
  const isFieldDisabled = () => {
    // Campos Código, Título, Tipo e Processo sempre desabilitados para todos os casos
    return true;
  };

  // Função para verificar se o usuário tem acesso ADMIN ou SGQ
  const hasAdminOrSGQAccess = () => {
    return hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN, AUTHORITIES.SGQ]);
  };

  return (
    <>
      <Box style={{ background: '#fff' }} paddingX={3} className="ms-4 me-4 pb-5 mb-1">
        <Row className="justify-content-center mt-3">
          <Breadcrumbs aria-label="breadcrumb" className="pt-4 pb-4">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Informações documentadas
            </Link>
            <Link to={'/infodoc'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Distribuição - Recebimento
            </Link>
            {/* <Typography style={{ color: '#606060' }}>Ficha de estoque</Typography> */}
          </Breadcrumbs>
        </Row>

        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Código"
              name="number"
              autoComplete="off"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              disabled={isFieldDisabled()}
              InputProps={{
                readOnly: isFieldDisabled(),
              }}
            />
            <TextField
              sx={{ width: '50%' }}
              label="Título"
              name="number"
              autoComplete="off"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              disabled={isFieldDisabled()}
              InputProps={{
                readOnly: isFieldDisabled(),
              }}
            />
            <TextField
              label="Tipo"
              name="Tipo"
              value={TipoControleDoc}
              disabled={isFieldDisabled()}
              onChange={e => setTipoControleDoc(e.target.value)}
              InputProps={{
                readOnly: isFieldDisabled(),
              }}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl style={{ width: '50%' }}>
              <InputLabel>Responsável</InputLabel>
              <Select label="Responsável" value={idUsuarioEntrega} onChange={event => setIdUsuarioEntrega(Number(event.target.value))}>
                {filteredUsers.map((user, i) => (
                  <MenuItem value={user.id} key={`user-${i}`}>
                    {user.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ width: '20%' }}>
              <InputLabel>Área / Processo</InputLabel>
              <Select
                label="Área / Processo"
                value={idProcesso}
                onChange={event => setIdProcesso(Number(event.target.value))}
                disabled={isFieldDisabled()}
                inputProps={{
                  readOnly: isFieldDisabled(),
                }}
              >
                {processes.map((process: any, i) => (
                  <MenuItem value={process.id} key={`process-${i}`}>
                    {process.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ width: '15%' }}>
              <InputLabel>Recebido</InputLabel>
              <Select label="Recebido" value={String(isRecebido)} onChange={event => setIsRecebido(event.target.value === 'true')}>
                {['Sim', 'Não'].map((label, index) => (
                  <MenuItem key={index} value={String(index === 0)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ width: '15%', height: '50px' }}>
              <DatePicker
                selected={dataEntrega}
                onChange={date => setDataEntrega(date)}
                className="date-picker"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="" className="rnc-date-label">
                Data
              </label>
            </FormControl>
          </Stack>
          <Textarea
            className="w-100"
            slots={{ textarea: JustifyFalta }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={comentarioEntrega || ''}
            onChange={e => setComentarioEntrega(e.target.value)}
          />

          {hasAdminOrSGQAccess() && (
            <>
              <Stack direction="row" spacing={2}>
                <FormControl style={{ width: '50%' }}>
                  <InputLabel>SGQ</InputLabel>
                  <Select label="SGQ" value={idUsuarioDevolucao} onChange={event => setIdUsuarioDevolucao(Number(event.target.value))}>
                    {usersSGQ.map((user, i) => (
                      <MenuItem value={user.id} key={`user-${i}`}>
                        {user.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ width: '17.5%' }}>
                  <InputLabel>Justificado</InputLabel>
                  <Select label="Justificado" value={String(isJustify)} onChange={event => setIsJustify(event.target.value === 'true')}>
                    {['Sim', 'Não'].map((label, index) => (
                      <MenuItem key={index} value={String(index === 0)}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ width: '17.5%' }}>
                  <InputLabel>Devolvido</InputLabel>
                  <Select label="Devolvido" value={String(isDevolvido)} onChange={event => setIsDevolvido(event.target.value === 'true')}>
                    {['Sim', 'Não'].map((label, index) => (
                      <MenuItem key={index} value={String(index === 0)}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ width: '15%', height: '50px' }}>
                  <DatePicker
                    selected={dataDevolucao}
                    onChange={date => setDataDevolucao(date)}
                    className="date-picker"
                    dateFormat={'dd/MM/yyyy'}
                  />
                  <label htmlFor="" className="rnc-date-label">
                    Data
                  </label>
                </FormControl>
              </Stack>
              <Textarea
                className="w-100"
                slots={{ textarea: justifyDevolution }}
                slotProps={{ textarea: { placeholder: '' } }}
                sx={{ borderRadius: '6px' }}
                name="ncArea"
                value={comentarioDevolucao || ''}
                onChange={e => setComentarioDevolucao(e.target.value)}
              />
            </>
          )}

          <Box style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => cancelDocument()}
            >
              Voltar
            </Button>
            <Button onClick={() => void saveDocument()} style={{ background: '#e6b200', color: '#4e4d4d' }}>
              Confirmar
            </Button>
          </Box>
        </Stack>
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

export default ComproveRecebimento;
