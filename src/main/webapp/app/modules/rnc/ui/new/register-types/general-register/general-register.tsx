import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import Textarea from '@mui/joy/Textarea';
import { styled } from '@mui/joy/styles';
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { Action, Rnc } from 'app/modules/rnc/models';
import { list, saveEffectCause, saveImmediateAction, savePlannedAction, saveRange, saveReason } from 'app/modules/rnc/reducers/rnc.reducer';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row } from 'reactstrap';
import { ImmediateActions, ScopeAnalysis } from '../../../components';
import './general-register.css';

const StyledTextarea = styled(TextareaAutosize)({
  resize: 'none',
  border: 'none', // remove the native textarea border
  minWidth: 0, // remove the native textarea width
  outline: 0, // remove the native textarea outline
  padding: 0, // remove the native textarea padding
  paddingBlockStart: '1em',
  paddingInlineEnd: `var(--Textarea-paddingInline)`,
  flex: 'auto',
  alignSelf: 'stretch',
  color: 'inherit',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontStyle: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  '&::placeholder': {
    opacity: 0,
    transition: '0.1s ease-out',
  },
  '&:focus::placeholder': {
    opacity: 1,
  },
  // specific to TextareaAutosize, cannot use '&:focus ~ label'
  '&:focus + textarea + label, &:not(:placeholder-shown) + textarea + label': {
    top: '0.5rem',
    fontSize: '0.75rem',
  },
  '&:focus + textarea + label': {
    color: 'var(--Textarea-focusedHighlight)',
  },
});

const StyledLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  top: 'calc((var(--Textarea-minHeight) - 1em) / 2)',
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.vars.fontWeight.md,
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InnerTextareaNC = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>NC</StyledLabel>
    </React.Fragment>
  );
});

const InnerTextareaCausa = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Causa</StyledLabel>
    </React.Fragment>
  );
});

export const GeneralRegister = ({ handleTela, handleUpdateRNC, findRNCById }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [registerForm, setRegisterForm] = useState({
    decision: {
      value: '',
      error: false,
    },
    keywords: {
      value: [],
      error: false,
    },
    keyword: {
      value: '',
      error: false,
    },
    descricaoAcao: {
      value: '',
      error: false,
    },
    prazo: {
      value: '',
      error: false,
    },
    responsavel: {
      value: '',
      error: false,
    },
    status: {
      value: '',
      error: false,
    },
    implementationDate: {
      value: new Date(),
      error: false,
    },
    decisaoResponsavel: {
      value: '',
      error: false,
    },
    investigacaoCausa: {
      value: '',
      error: false,
    },
    decisaoQtdSelecionada: {
      value: '0',
      error: false,
    },
    decisaoQtdAprovada: {
      value: '0',
      error: false,
    },
    decisaoQtdReprovada: {
      value: '0',
      error: false,
    },
    decisaoPercentRejeicao: {
      value: '0',
      error: false,
    },
    planoAcaoDescricao: {
      value: '',
      error: false,
    },
    planoAcaoPrazo: {
      value: '',
      error: false,
    },
    planoAcaoResponsavel: {
      value: '',
      error: false,
    },
    planoAcaoStatus: {
      value: '',
      error: false,
    },
    planoAcaoVerificacao: {
      value: '',
      error: false,
    },
    planoAcaoResponsavelVerificacao: {
      value: '',
      error: false,
    },
    causaMeioAmbiente: {
      value: [],
      error: false,
    },
    causaMaoObra: {
      value: [],
      error: false,
    },
    causaMetodo: {
      value: [],
      error: false,
    },
    causaMaquina: {
      value: [],
      error: false,
    },
    causaMedicao: {
      value: [],
      error: false,
    },
    causaMateriaPrima: {
      value: [],
      error: false,
    },
    fiveWhy_n1: {
      value: '',
    },
    fiveWhy_n2: {
      value: '',
    },
    fiveWhy_n3: {
      value: '',
    },
    fiveWhy_n4: {
      value: '',
    },
    fiveWhy_n5: {
      value: '',
    },
  });

  const rncs: Array<Rnc> = useAppSelector(state => state.all4qmsmsgateway.rnc.entities);

  const [_rnc, _setrnc] = useState(findRNCById(id));

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(list({}));
  }, []);

  const [k, setK] = useState('');

  const [descAction, setDescAction] = useState('');
  const [descPrazo, setDescPrazo] = useState(new Date());
  const [descResponsavel, setDescResponsavel] = useState('');
  const [descStatus, setDescStatus] = useState('');

  const [listDesc, setListDesc] = useState([]);

  /*
   * Immediate action
   */
  const [actions, setActions] = useState<Array<Action>>([]);

  const onActionAdded = (action: Action): void => {
    setActions([...actions, action]);
  };

  const onActionRemoved = (action: Action): void => {
    const idx = actions.indexOf(action);

    if (idx < 0) {
      return;
    }

    const newActions = actions.filter((_, index) => index !== idx);
    setActions([...newActions]);
  };

  const appendToListDesc = () => {
    if (descAction === '' || descPrazo === null || descResponsavel === '' || descStatus === '') return;

    const newItem = {
      descAction: descAction,
      descPrazo: descPrazo,
      descResponsavel: descResponsavel,
      descStatus: descStatus,
    };

    setListDesc([...listDesc, newItem]);
    setDescAction('');
    setDescPrazo(new Date());
    setDescResponsavel('');
    setDescStatus('');
  };

  const [descPlanoAcao, setDescPlanoAcao] = useState('');
  const [responsalvePlanoAcao, setResponsalvePlanoAcao] = useState('');
  const [prazoPlanoAcao, setPrazoPlanoAcao] = useState(new Date());
  const [listPlanoAcao, setListPlanoAcao] = useState([]);
  const [responsaveisMP, setResponsaveisMP] = useState([]);
  const [responsaveisVerificacao, setResponsaveisVerificacao] = useState([]);
  const [responsaveisPlanoAcao, setResponsaveisPlanoAcao] = useState([]);

  const handleChangeResponsaveisMP = (event: SelectChangeEvent<typeof responsaveisMP>) => {
    const {
      target: { value },
    } = event;
    setResponsaveisMP(typeof value === 'string' ? value.split(',') : value);
  };

  const appendToListPlanoAcao = () => {
    if (responsalvePlanoAcao === '' || prazoPlanoAcao === null || descPlanoAcao === '') return;

    const newItem = {
      descPlanoAcao: descPlanoAcao,
      responsalvePlanoAcao: responsalvePlanoAcao,
      prazoPlanoAcao: prazoPlanoAcao,
    };

    setListPlanoAcao([...listPlanoAcao, newItem]);
    setPrazoPlanoAcao(new Date());
    setDescPlanoAcao('');
    setResponsalvePlanoAcao('');
  };

  const handleRemoveItem = (index: number) => {
    const updatedList = [...listDesc];
    updatedList.splice(index, 1);
    setListDesc(updatedList);
  };

  const renderListDesc = () => {
    return (
      <>
        {listDesc.map((desc, index) => (
          <div key={index} className="m-2 ms-0">
            <div style={{ display: 'flex', flexDirection: 'column' }} className="mt-2 w-100">
              <textarea
                className="textarea-ishikawa"
                style={{ padding: '8px 12px' }}
                name="ncArea"
                rows={5}
                cols={30}
                placeholder="Descrição da ação"
                value={descAction}
                onChange={e => setDescAction(e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2">
                <FormControl className="m-2 ms-0 mb-2">
                  <DatePicker
                    // locale='pt-BR'
                    label="Prazo"
                    selected={descPrazo}
                    onChange={date => setDescPrazo(date)}
                    className="date-picker"
                    dateFormat={'dd/MM/yyyy'}
                    id="date-picker-rnc-acao-prazo"
                  />
                </FormControl>

                <TextField
                  label="Responsável"
                  id="rnc-text-field"
                  className="m-2 rnc-form-field"
                  sx={{ width: '20% !important' }}
                  value={desc.descResponsavel}
                />
                <TextField
                  label="Status"
                  id="rnc-text-field"
                  className="m-2 rnc-form-field"
                  sx={{ width: '20% !important' }}
                  value={desc.descStatus}
                />
                <IconButton aria-label="Remover" onClick={() => handleRemoveItem(index)}>
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  const [responsaveis, setResponsaveis] = useState([]);

  const [listaAcoesCorretivas, setListaAcoesCorretivas] = useState([]);

  const setAcao = (e: any) => {
    handleChange({ ...registerForm, descricaoAcao: { value: e.target.value, error: registerForm.descricaoAcao.error } });
  };

  const handleChange = (value: any) => {
    setRegisterForm(value);
    // onRegisterChange(registerForm);
  };

  const [checkedIshikawa, setCheckedIshikawa] = React.useState(false);
  const handleCheckIshikawaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedIshikawa(!checkedIshikawa);
  };

  const [checkedFiveWhy, setCheckedFiveWhy] = React.useState(false);
  const handleCheckFiveWhy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedFiveWhy(!checkedFiveWhy);
  };

  const handleRemoveKeyword = (keyword: string) => {
    handleChange({
      ...registerForm,
      keywords: {
        value: registerForm.keywords.value.filter((kw: string) => kw !== keyword),
        error: registerForm.keywords.error,
      },
    });
  };

  const handleRemoveListaAcoesCorretivasItem = (index: number) => {
    const updatedList = [...listaAcoesCorretivas];
    updatedList.splice(index, 1);
    setListaAcoesCorretivas(updatedList);
  };

  const renderListaAcoesCorretivas = () => {
    return listaAcoesCorretivas.map((item, index) => (
      <>
        <TextField
          label="Descrição da ação"
          id="rnc-text-field"
          className="w-100 desc-width m-2"
          onChange={e =>
            handleChange({
              ...registerForm,
              planoAcaoDescricao: { value: e.target.value, error: registerForm.planoAcaoDescricao.error },
            })
          }
        />
        <div key={index} style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
          <FormControl className="m-2 mt-0 rnc-form-field">
            <DatePicker
              // locale='pt-BR'
              label="Prazo"
              selected={prazoPlanoAcao}
              onChange={date => setPrazoPlanoAcao(date)}
              className="date-picker"
              dateFormat={'dd/MM/yyyy'}
              id="date-picker-rnc-plano-acao-prazo"
            />
          </FormControl>
          <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
            <InputLabel>Responsável</InputLabel>
            <Select
              label="Encaminhado para:"
              name="forwarded"
              onChange={e => setResponsaveisPlanoAcao([...responsaveisPlanoAcao, e.target.value])}
            >
              {users.map((user, i) => (
                <MenuItem value={user.login} key={`user-${i}`}>
                  {user.login}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
            <InputLabel>Status</InputLabel>
            <Select label="Encaminhado para:" name="forwarded">
              <MenuItem value="Status 1">Status 1</MenuItem>
              <MenuItem value="Status 2">Status 2</MenuItem>
              <MenuItem value="Status 3">Status 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
            <InputLabel>Verificação</InputLabel>
            <Select label="Encaminhado para:" name="forwarded">
              <MenuItem value="Verificacao 1">Verificação 1</MenuItem>
              <MenuItem value="Verificacao 2">Verificação 2</MenuItem>
              <MenuItem value="Verificacao 3">Verificação 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
            <InputLabel>Resp. verificação</InputLabel>
            <Select
              label="Encaminhado para:"
              name="forwarded"
              onChange={e => setResponsaveisVerificacao([...responsaveisVerificacao, e.target.value])}
            >
              {users.map((user, i) => (
                <MenuItem value={user.login} key={`user-${i}`}>
                  {user.login}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton aria-label="Remover" onClick={() => handleRemoveListaAcoesCorretivasItem(index)}>
            <DeleteIcon fontSize="medium" />
          </IconButton>
        </div>
      </>
    ));
  };

  const renderResponsaveis = () => {
    return responsaveis.map((responsavel, index) => (
      <FormControl className="w-100">
        <InputLabel>Responsável</InputLabel>
        <Select
          label="Responsável"
          name="forwarded"
          // disabled={false}
          value={responsavel}
          disabled
          // onChange={e => setResponsaveis([...responsaveis, e.target.value])}
        >
          {users.map((user, i) => (
            <MenuItem value={user.login} key={`user-${i}`}>
              {user.login}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ));
  };

  const setTitleMPOrigin = () => {
    if (_rnc?.origin === 'mp') {
      return 'Decisão sobre Matéria-Prima/Insumo';
    } else if (_rnc?.origin === 'endProduct') {
      return 'Decisão sobre Produto Acabado';
    }
  };
  const optionsResponsavelMateriaPrima = [
    { label: 'Responsavel 1', value: 'Responsavel 1' },
    { label: 'Responsavel 2', value: 'Responsavel 2' },
    { label: 'Responsavel 3', value: 'Responsavel 3' },
    { label: 'Responsavel 4', value: 'Responsavel 4' },
    { label: 'Responsavel 5', value: 'Responsavel 5' },
  ];

  const [selectedResponsavelMateriaPrima, setSelectedResponsavelMateriaPrima] = useState([]);

  const validarInvestigacao = () => {
    if (!checkedFiveWhy && !checkedIshikawa) return false;

    if (checkedFiveWhy) {
      let counter = 0;
      counter = registerForm.fiveWhy_n1.value !== '' ? counter + 1 : counter;
      counter = registerForm.fiveWhy_n2.value !== '' ? counter + 1 : counter;
      counter = registerForm.fiveWhy_n3.value !== '' ? counter + 1 : counter;
      counter = registerForm.fiveWhy_n4.value !== '' ? counter + 1 : counter;
      counter = registerForm.fiveWhy_n5.value !== '' ? counter + 1 : counter;
      if (counter < 3) {
        return false;
      }
    }
    if (checkedIshikawa) {
      if (
        registerForm.causaMeioAmbiente.value.length > 0 ||
        registerForm.causaMaoObra.value.length > 0 ||
        registerForm.causaMetodo.value.length > 0 ||
        registerForm.causaMaquina.value.length > 0 ||
        registerForm.causaMedicao.value.length > 0 ||
        registerForm.causaMateriaPrima.value.length > 0
      ) {
        return true;
      }
      return false;
    }

    return true;
  };

  const buttonAvancarDisabled = !validarInvestigacao();

  const [showPlanoAcaoCorretiva, setShowPlanoAcaoCorretiva] = useState(false);
  const users = useAppSelector(state => state.userManagement.users);

  const filterUser = (login: string) => {
    if (!users || users.length <= 0) {
      return null;
    }

    return users.find(user => user.login === login);
  };

  const filterRnc = () => {
    if (!rncs || rncs.length <= 0) {
      return null;
    }

    return rncs.find(rnc => rnc.id === parseInt(id));
  };

  return (
    <>
      <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
        <Row className="justify-content-center mt-5">
          <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Link to={'/rnc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              RNC
            </Link>
            <Link to={'/rnc/general'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Relatório de Não conformidade
            </Link>
          </Breadcrumbs>
        </Row>
        <div className="container-style">
          <ScopeAnalysis
            keywords={registerForm.keywords.value}
            onChanged={keywords =>
              handleChange({
                ...registerForm,
                keywords: {
                  value: [...keywords],
                  error: registerForm.keywords.error,
                },
              })
            }
          />

          <div className="mt-3">
            <ImmediateActions actions={actions} onAdded={onActionAdded} onRemoved={onActionRemoved} users={users.map(u => u.login)} />
          </div>

          <Divider light />
          {(_rnc?.origin === 'mp' || _rnc?.origin === 'endProduct') && (
            <div className="fake-card mt-3">
              <Typography variant="h5" component="div">
                {setTitleMPOrigin()}
              </Typography>
              <br />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="mt-2 mb-2">
                <FormControl className="mb-2 rnc-form-field me-2" sx={{ display: 'flex', maxWidth: '40%' }}>
                  <InputLabel>Decisão</InputLabel>
                  <Select
                    label="Decisão"
                    name="decision"
                    value={registerForm.decision.value}
                    onChange={event =>
                      setRegisterForm({ ...registerForm, decision: { value: event.target.value, error: registerForm.decision.error } })
                    }
                  >
                    <MenuItem value="retrabalho">Retrabalho</MenuItem>
                    <MenuItem value="seleção">Seleção</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ height: '60px', maxWidth: '50% !important' }}
                  label="Descrição da decisão"
                  name="number"
                  id="rnc-text-field"
                  // value={firstForm.number.value}
                  className="rnc-form-field me-2 mb-2"
                />

                <FormControl className="mb-2 rnc-form-field me-2">
                  <DatePicker
                    selected={registerForm.implementationDate.value}
                    onChange={date =>
                      handleChange({ ...registerForm, implementationDate: { value: date, error: registerForm.implementationDate.error } })
                    }
                    className="date-picker"
                    dateFormat={'dd/MM/yyyy'}
                    id="date-picker-general-register"
                  />
                  <label htmlFor="" className="rnc-date-label">
                    Data
                  </label>
                </FormControl>
              </div>
              <br />
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '196px' }}
                className="mt-2 mb-2"
              >
                <Card
                  className="p-3"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '30%',
                    maxHeight: '194px !important',
                    minHeight: '194px !important',
                    overflowY: 'scroll',
                  }}
                >
                  <FormControl className="w-100 m-2">
                    <InputLabel>Responsável</InputLabel>
                    <Select
                      multiple
                      value={responsaveisMP}
                      onChange={handleChangeResponsaveisMP}
                      input={<OutlinedInput label="Responsáveis" />}
                      renderValue={selected => selected.join(', ')}
                    >
                      {users.map((user, i) => (
                        <MenuItem value={user.login} key={`user-${i}`}>
                          <Checkbox checked={responsaveisMP.indexOf(user.login) > -1} />
                          <ListItemText primary={user.login} />
                          {/* {user.login} */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {renderResponsaveis()}
                </Card>
                <div
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '60%', height: '100%' }}
                  className="ms-3"
                >
                  {registerForm.decision.value == 'retrabalho' ? (
                    <Card className="p-2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <TextField
                        label="Quantidade retrabalhada"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoQtdSelecionada: { value: event.target.value, error: registerForm.decisaoQtdSelecionada.error },
                          })
                        }
                      />
                      <TextField
                        label="Quantidade aprovada"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoQtdAprovada: { value: event.target.value, error: registerForm.decisaoQtdAprovada.error },
                          })
                        }
                      />
                      <TextField
                        label="Quantidade reprovada"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoQtdReprovada: { value: event.target.value, error: registerForm.decisaoQtdReprovada.error },
                          })
                        }
                      />
                      <TextField
                        label="% Rejeição"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoPercentRejeicao: { value: event.target.value, error: registerForm.decisaoPercentRejeicao.error },
                          })
                        }
                      />
                    </Card>
                  ) : (
                    <Card className="p-2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <TextField
                        label="Quantidade selecionada"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoQtdSelecionada: { value: event.target.value, error: registerForm.decisaoQtdSelecionada.error },
                          })
                        }
                      />
                      <TextField
                        label="Quantidade aprovada"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoQtdAprovada: { value: event.target.value, error: registerForm.decisaoQtdAprovada.error },
                          })
                        }
                      />
                      <TextField
                        label="Quantidade reprovada"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoQtdReprovada: { value: event.target.value, error: registerForm.decisaoQtdReprovada.error },
                          })
                        }
                      />
                      <TextField
                        label="% Rejeição"
                        className="m-2"
                        sx={{ width: '20% !important' }}
                        type="number"
                        onChange={event =>
                          setRegisterForm({
                            ...registerForm,
                            decisaoPercentRejeicao: { value: event.target.value, error: registerForm.decisaoPercentRejeicao.error },
                          })
                        }
                      />
                    </Card>
                  )}
                </div>
              </div>
              <br />
            </div>
          )}
          <Divider light />
          <Card sx={{ minWidth: 275 }} className="mt-3 mb-2">
            <CardContent>
              <Typography variant="h5" component="div">
                Investigação de causas
              </Typography>
              <div className="mt-2" style={{ display: 'flex' }}>
                <FormControlLabel control={<Checkbox />} onChange={handleCheckIshikawaChange} label="ISHIKAWA" />
                <FormControlLabel control={<Checkbox />} onChange={handleCheckFiveWhy} label="Resposta dos 5 porquês" />
              </div>
              {checkedIshikawa && (
                <Card className="mt-2">
                  <div className="flex p-2" style={{ justifyContent: 'space-between' }}>
                    <div className="flex-col">
                      <br />
                      <Textarea
                        slots={{ textarea: InnerTextareaNC }}
                        slotProps={{ textarea: { placeholder: 'NC' } }}
                        sx={{ borderRadius: '6px' }}
                        name="ncArea"
                        value={_rnc?.descricaoNC || ''}
                        readOnly
                      />
                      {/*                       <textarea className="textarea-ishikawa" name="ncArea" rows={5} cols={30} placeholder="NC" value={id} readOnly/>
                       */}{' '}
                    </div>
                    <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
                      <Autocomplete
                        multiple
                        className="m-2"
                        id="tags-outlined"
                        options={['']}
                        defaultValue={[]}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                        }
                        disableClearable
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Meio Ambiente"
                            onChange={e => {
                              handleChange({
                                ...registerForm,
                                causaMeioAmbiente: {
                                  value: [...registerForm.causaMeioAmbiente.value, e.target.value],
                                  error: registerForm.causaMeioAmbiente.error,
                                },
                              });
                            }}
                          />
                        )}
                      />
                      <Autocomplete
                        multiple
                        className="m-2"
                        id="tags-outlined"
                        options={['']}
                        defaultValue={[]}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                        }
                        disableClearable
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Máquina"
                            onChange={e => {
                              handleChange({
                                ...registerForm,
                                causaMaquina: {
                                  value: [...registerForm.causaMaquina.value, e.target.value],
                                  error: registerForm.causaMaquina.error,
                                },
                              });
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
                      <Autocomplete
                        multiple
                        className="m-2"
                        id="tags-outlined"
                        options={['']}
                        defaultValue={[]}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                        }
                        disableClearable
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Mão de obra"
                            onChange={e => {
                              handleChange({
                                ...registerForm,
                                causaMaoObra: {
                                  value: [...registerForm.causaMaoObra.value, e.target.value],
                                  error: registerForm.causaMaoObra.error,
                                },
                              });
                            }}
                          />
                        )}
                      />
                      <Autocomplete
                        multiple
                        className="m-2"
                        id="tags-outlined"
                        options={['']}
                        defaultValue={[]}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                        }
                        disableClearable
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Medição"
                            onChange={e => {
                              handleChange({
                                ...registerForm,
                                causaMedicao: {
                                  value: [...registerForm.causaMedicao.value, e.target.value],
                                  error: registerForm.causaMedicao.error,
                                },
                              });
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
                      <Autocomplete
                        multiple
                        className="m-2"
                        id="tags-outlined"
                        options={['']}
                        defaultValue={[]}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                        }
                        disableClearable
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Método"
                            onChange={e => {
                              handleChange({
                                ...registerForm,
                                causaMetodo: {
                                  value: [...registerForm.causaMetodo.value, e.target.value],
                                  error: registerForm.causaMetodo.error,
                                },
                              });
                            }}
                          />
                        )}
                      />
                      <Autocomplete
                        multiple
                        className="m-2"
                        id="tags-outlined"
                        options={['']}
                        defaultValue={[]}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                        }
                        disableClearable
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Matéria-prima"
                            onChange={e => {
                              handleChange({
                                ...registerForm,
                                causaMateriaPrima: {
                                  value: [...registerForm.causaMateriaPrima.value, e.target.value],
                                  error: registerForm.causaMateriaPrima.error,
                                },
                              });
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {checkedFiveWhy && (
                <Card className="mt-2">
                  <div className="flex p-2">
                    <div className="flex-col">
                      <br />
                      <Textarea
                        slots={{ textarea: InnerTextareaNC }}
                        slotProps={{ textarea: { placeholder: 'NC' } }}
                        sx={{ borderRadius: '6px' }}
                        name="ncArea"
                        value={_rnc?.descricaoNC || ''}
                        readOnly
                      />

                      {/*  <textarea
                        className="textarea-ishikawa mb-2"
                        style={{ height: '100%' }}
                        placeholder="NC"
                        name="ncArea"
                        rows={5}
                        cols={30}
                        value={_rnc}
                        readOnly
                      />  */}
                    </div>
                    <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
                      <TextField
                        label="Porquê?"
                        className="m-2"
                        required
                        onChange={e => setRegisterForm({ ...registerForm, fiveWhy_n1: { value: e.target.value } })}
                      />
                      <TextField
                        label="Porquê?"
                        className="m-2"
                        required
                        onChange={e => setRegisterForm({ ...registerForm, fiveWhy_n2: { value: e.target.value } })}
                      />
                      <TextField
                        label="Porquê?"
                        className="m-2"
                        required
                        onChange={e => setRegisterForm({ ...registerForm, fiveWhy_n3: { value: e.target.value } })}
                      />
                      <TextField
                        label="Porquê?"
                        className="m-2"
                        onChange={e => setRegisterForm({ ...registerForm, fiveWhy_n4: { value: e.target.value } })}
                      />
                      <TextField
                        label="Porquê?"
                        className="m-2"
                        onChange={e => setRegisterForm({ ...registerForm, fiveWhy_n5: { value: e.target.value } })}
                      />
                    </div>
                    <div className="flex-col">
                      <br />
                      <Textarea
                        slots={{ textarea: InnerTextareaCausa }}
                        slotProps={{ textarea: { placeholder: 'Causa', label: 'Causa' } }}
                        sx={{ borderRadius: '6px' }}
                        name="ncArea"
                        value={_rnc?.descricaoNC || ''}
                        readOnly
                      />
                      {/* <textarea
                        className="textarea-ishikawa mb-2"
                        style={{ height: '100%' }}
                        placeholder="Causa"
                        name="ncArea"
                        rows={5}
                        cols={30}
                      /> */}
                    </div>
                  </div>
                </Card>
              )}
            </CardContent>
          </Card>
          {showPlanoAcaoCorretiva && (
            <div className="fake-card mt-2">
              <Typography variant="h5" component="div">
                Plano de Ação Corretiva
              </Typography>
              <br />
              <TextField
                label="Descrição da ação"
                id="rnc-text-field"
                className="w-100 desc-width m-2"
                onChange={e =>
                  handleChange({
                    ...registerForm,
                    planoAcaoDescricao: { value: e.target.value, error: registerForm.planoAcaoDescricao.error },
                  })
                }
              />
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
                <FormControl className="m-2 mt-0 rnc-form-field">
                  <DatePicker
                    // locale='pt-BR'
                    label="Prazo"
                    selected={prazoPlanoAcao}
                    onChange={date => setPrazoPlanoAcao(date)}
                    className="date-picker"
                    dateFormat={'dd/MM/yyyy'}
                    id="date-picker-rnc-plano-acao-prazo"
                  />
                </FormControl>
                <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
                  <InputLabel>Responsável</InputLabel>
                  <Select
                    label="Encaminhado para:"
                    name="forwarded"
                    onChange={e => setResponsaveisPlanoAcao([...responsaveisPlanoAcao, e.target.value])}
                  >
                    {users.map((user, i) => (
                      <MenuItem value={user.login} key={`user-${i}`}>
                        {user.login}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
                  <InputLabel>Status</InputLabel>
                  <Select label="Encaminhado para:" name="forwarded">
                    <MenuItem value="Status 1">Status 1</MenuItem>
                    <MenuItem value="Status 2">Status 2</MenuItem>
                    <MenuItem value="Status 3">Status 3</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
                  <InputLabel>Verificação</InputLabel>
                  <Select label="Encaminhado para:" name="forwarded">
                    <MenuItem value="Verificacao 1">Verificação 1</MenuItem>
                    <MenuItem value="Verificacao 2">Verificação 2</MenuItem>
                    <MenuItem value="Verificacao 3">Verificação 3</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
                  <InputLabel>Resp. verificação</InputLabel>
                  <Select
                    label="Encaminhado para:"
                    name="forwarded"
                    onChange={e => setResponsaveisVerificacao([...responsaveisVerificacao, e.target.value])}
                  >
                    {users.map((user, i) => (
                      <MenuItem value={user.login} key={`user-${i}`}>
                        {user.login}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div style={{ marginLeft: 'auto' }}>
                  <Fab
                    color="primary"
                    aria-label="add"
                    size="medium"
                    className="btn-add-fab me-2"
                    onClick={() => setListaAcoesCorretivas([...listaAcoesCorretivas, 1])}
                  >
                    <Add />
                  </Fab>
                </div>
              </div>
              {renderListaAcoesCorretivas()}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => navigate('/rnc')}
            >
              Voltar
            </Button>

            <Button
              className="ms-3"
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
              onClick={() => {
                if (!showPlanoAcaoCorretiva) {
                  setShowPlanoAcaoCorretiva(true);
                  return;
                }

                if (showPlanoAcaoCorretiva) {
                  const rnc = filterRnc();

                  dispatch(saveRange({ description: registerForm.keywords.value.join(','), rncId: rnc.id }));
                  dispatch(
                    saveImmediateAction({
                      deadline: descPrazo,
                      description: '',
                      problem: '',
                      responsibleId: filterUser(descResponsavel)?.id,
                      rncId: rnc.id,
                      status: 'A',
                      validated: false,
                      verifierId: filterUser(descResponsavel)?.id,
                    })
                  );
                  dispatch(
                    saveEffectCause({
                      description: '',
                      environment: registerForm.causaMeioAmbiente.value.toString(),
                      machine: registerForm.causaMaquina.value.toString(),
                      measurement: registerForm.causaMedicao.value.toString(),
                      method: registerForm.causaMetodo.value.toString(),
                      rawMaterial: registerForm.causaMateriaPrima.value.toString(),
                      workforce: registerForm.causaMaoObra.value.toString(),
                    })
                  );
                  dispatch(
                    saveReason({
                      cause: '',
                      fifth: registerForm.fiveWhy_n5.value.toString(),
                      first: registerForm.fiveWhy_n1.value.toString(),
                      forth: registerForm.fiveWhy_n4.value.toString(),
                      problem: '',
                      second: registerForm.fiveWhy_n2.value.toString(),
                      third: registerForm.fiveWhy_n3.value.toString(),
                    })
                  );
                  dispatch(
                    savePlannedAction({
                      date: new Date(registerForm.planoAcaoPrazo.value),
                      deadline: new Date(registerForm.planoAcaoPrazo.value),
                      description: registerForm.planoAcaoDescricao.value.toString(),
                      plan: {
                        description: '',
                        deadline: new Date(registerForm.planoAcaoPrazo.value),
                        responsibleId: filterUser(registerForm.planoAcaoResponsavel.value)?.id,
                        rncId: rnc.id,
                        status: 'A',
                      },
                      responsibleId: filterUser(registerForm.planoAcaoResponsavel.value)?.id,
                      status: registerForm.planoAcaoStatus.value,
                    })
                  );

                  navigate('/rnc');
                  toast.success('RNC atualizada com sucesso!');
                }
              }}
              disabled={buttonAvancarDisabled}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralRegister;
