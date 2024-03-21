import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/joy/styles';
import {
  Breadcrumbs,
  Button,
  Card,
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
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { Action, ActionPlan, IshikawaInvestigation, ReasonsInvestigation, Rnc } from 'app/modules/rnc/models';
import {
  saveEffectCause,
  saveImmediateAction,
  savePlannedAction,
  saveRange,
  saveReason,
  getById,
  update,
} from 'app/modules/rnc/reducers/rnc.reducer';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row } from 'reactstrap';
import { CauseInvestigation, ImmediateActions, PlannedActions, ScopeAnalysis } from '../../../components';
import './general-register.css';
import { listEnums } from '../../../../reducers/enums.reducer';
import { Enums } from '../../../../models';
import { savePlan } from 'app/modules/rnc/reducers/plan.reducer';

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

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());

    if (id) {
      dispatch(getById(parseInt(id)));
    }
  }, []);

  const [descPrazo, setDescPrazo] = useState(new Date());
  const [descResponsavel, setDescResponsavel] = useState('');

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

  /*
   * Cause investigation
   */
  const [ishikawaInvestigation, setIshikawaInvestigation] = useState<IshikawaInvestigation>();
  const [reasonsInvestigation, setReasonsInvestigation] = useState<ReasonsInvestigation>();

  const onIshikawaInvestigationChanged = (investigation: IshikawaInvestigation): void => {
    setIshikawaInvestigation(investigation);
  };

  const onReasonsInvestigationChanged = (investigation: ReasonsInvestigation): void => {
    setReasonsInvestigation(investigation);
  };

  const [prazoPlanoAcao, setPrazoPlanoAcao] = useState(new Date());
  const [responsaveisMP, setResponsaveisMP] = useState([]);
  const [responsaveisVerificacao, setResponsaveisVerificacao] = useState([]);
  const [responsaveisPlanoAcao, setResponsaveisPlanoAcao] = useState([]);

  const handleChangeResponsaveisMP = (event: SelectChangeEvent<typeof responsaveisMP>) => {
    const {
      target: { value },
    } = event;
    setResponsaveisMP(typeof value === 'string' ? value.split(',') : value);
  };

  const updateInvestigation = () => {
    if (_rnc) {
      dispatch(update({ ..._rnc, statusAtual: 'LEVANTAMENTO' }));
    }
  };

  const updateElaboration = () => {
    if (_rnc) {
      if (_rnc.statusAtual == 'LEVANTAMENTO') {
        dispatch(update({ ..._rnc, statusAtual: 'ELABORACAO' }));
      } else if (_rnc.statusAtual == 'ELABORACAO') {
        dispatch(update({ ..._rnc, statusAtual: 'EXECUCAO' }));
      }
    }
  };

  const [responsaveis, setResponsaveis] = useState([]);

  const [listaAcoesCorretivas, setListaAcoesCorretivas] = useState<Array<ActionPlan>>([]);

  const handleChange = (value: any) => {
    setRegisterForm(value);
    // onRegisterChange(registerForm);
  };

  const [checkedIshikawa, setCheckedIshikawa] = React.useState(false);

  const [checkedFiveWhy, setCheckedFiveWhy] = React.useState(false);

  const handleRemoveListaAcoesCorretivasItem = (index: number) => {
    const updatedList = [...listaAcoesCorretivas];
    updatedList.splice(index, 1);
    setListaAcoesCorretivas(updatedList);
  };

  const onActionPlansUpdated = (actionPlans: Array<ActionPlan>): void => {
    setListaAcoesCorretivas(actionPlans);
  };

  const renderListaAcoesCorretivas = () => {
    // return listaAcoesCorretivas.map((item, index) => (
    //   <>
    //     <TextField
    //       label="Descrição da ação"
    //       id="rnc-text-field"
    //       className="w-100 desc-width m-2"
    //       onChange={e =>
    //         handleChange({
    //           ...registerForm,
    //           planoAcaoDescricao: { value: e.target.value, error: registerForm.planoAcaoDescricao.error },
    //         })
    //       }
    //     />
    //     <div key={index} style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
    //       <FormControl className="m-2 mt-0 rnc-form-field">
    //         <DatePicker
    //           // locale='pt-BR'
    //           label="Prazo"
    //           selected={prazoPlanoAcao}
    //           onChange={date => setPrazoPlanoAcao(date)}
    //           className="date-picker"
    //           dateFormat={'dd/MM/yyyy'}
    //           id="date-picker-rnc-plano-acao-prazo"
    //         />
    //       </FormControl>
    //       <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
    //         <InputLabel>Responsável</InputLabel>
    //         <Select
    //           label="Encaminhado para:"
    //           name="forwarded"
    //           onChange={e => setResponsaveisPlanoAcao([...responsaveisPlanoAcao, e.target.value])}
    //         >
    //           {users.map((user, i) => (
    //             <MenuItem value={user.login} key={`user-${i}`}>
    //               {user.login}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl>

    //       <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
    //         <InputLabel>Status</InputLabel>
    //         <Select label="Encaminhado para:" name="forwarded" value={item.statusAcao}>
    //           <MenuItem value="Status 1">Status 1</MenuItem>
    //           <MenuItem value="Status 2">Status 2</MenuItem>
    //           <MenuItem value="Status 3">Status 3</MenuItem>
    //         </Select>
    //       </FormControl>

    //       <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
    //         <InputLabel>Verificação</InputLabel>
    //         <Select label="Encaminhado para:" name="forwarded">
    //           <MenuItem value="Verificacao 1">Verificação 1</MenuItem>
    //           <MenuItem value="Verificacao 2">Verificação 2</MenuItem>
    //           <MenuItem value="Verificacao 3">Verificação 3</MenuItem>
    //         </Select>
    //       </FormControl>

    //       <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
    //         <InputLabel>Resp. verificação</InputLabel>
    //         <Select
    //           label="Encaminhado para:"
    //           name="forwarded"
    //           onChange={e => }
    //         >
    //           {users.map((user, i) => (
    //             <MenuItem value={user.login} key={`user-${i}`}>
    //               {user.login}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl>
    //       <IconButton aria-label="Remover" onClick={() => handleRemoveListaAcoesCorretivasItem(index)}>
    //         <DeleteIcon fontSize="medium" />
    //       </IconButton>
    //     </div>
    //   </>
    // ));

    return (
      <PlannedActions
        actionPlans={listaAcoesCorretivas}
        onUpdated={onActionPlansUpdated}
        statuses={enums.actionPlanStatuses}
        users={users}
      />
    );
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
    if (_rnc.origemNC === 'MATERIA_PRIMA_INSUMO') {
      return 'Decisão sobre Matéria-Prima/Insumo';
    } else if (_rnc.origemNC === 'PRODUTO_ACABADO') {
      return 'Decisão sobre Produto Acabado';
    }
  };

  const [showPlanoAcaoCorretiva, setShowPlanoAcaoCorretiva] = useState(false);
  const users = useAppSelector(state => state.userManagement.users);

  const filterUser = (login: string) => {
    if (!users || users.length <= 0) {
      return null;
    }

    return users.find(user => user.login === login);
  };

  const _rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);
  const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);

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

          <ImmediateActions actions={actions} onAdded={onActionAdded} onRemoved={onActionRemoved} users={users.map(u => u.login)} />

          {(_rnc?.origemNC == 'MATERIA_PRIMA_INSUMO' || _rnc?.origemNC == 'PRODUTO_ACABADO') && (
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

          <CauseInvestigation
            description={''}
            onIshikawaInvestigationChanged={onIshikawaInvestigationChanged}
            onReasonsInvestigationChanged={onReasonsInvestigationChanged}
            checkIshikawa={setCheckedIshikawa}
            checkReasons={setCheckedFiveWhy}
          />

          {showPlanoAcaoCorretiva && (
            <div className="fake-card mt-2">
              <Typography variant="h5" component="div">
                Plano de Ação Corretiva
              </Typography>
              <br />
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
              onClick={() => {
                if (_rnc && !showPlanoAcaoCorretiva) {
                  dispatch(saveRange({ description: registerForm.keywords.value.join(','), rncId: _rnc.id }));
                  dispatch(
                    saveImmediateAction({
                      deadline: descPrazo,
                      description: '',
                      problem: '',
                      responsibleId: filterUser(descResponsavel)?.id,
                      rncId: _rnc.id,
                      status: 'A',
                      validated: false,
                      verifierId: filterUser(descResponsavel)?.id,
                    })
                  );

                  if (checkedIshikawa) {
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
                  }
                  if (checkedFiveWhy) {
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
                  }
                  dispatch(
                    savePlan({
                      actionPlans: listaAcoesCorretivas,
                      plan: {
                        dtConclusaoPlano: new Date(),
                        idNaoConformidade: _rnc.id,
                        percentualPlano: 0,
                        qtdAcoes: listaAcoesCorretivas.length,
                        qtdAcoesConcluidas: 0,
                        statusPlano: 'ABERTO',
                      },
                    })
                  );
                  toast.success('RNC atualizada com sucesso!');
                } else if (_rnc && showPlanoAcaoCorretiva) {
                  dispatch(
                    savePlan({
                      actionPlans: listaAcoesCorretivas,
                      plan: {
                        dtConclusaoPlano: new Date(),
                        idNaoConformidade: _rnc.id,
                        percentualPlano: 0,
                        qtdAcoes: listaAcoesCorretivas.length,
                        qtdAcoesConcluidas: 0,
                        statusPlano: 'ABERTO',
                      },
                    })
                  );
                }
              }}
            >
              Salvar
            </Button>

            <Button
              className="ms-3"
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
              onClick={() => {
                if (!showPlanoAcaoCorretiva) {
                  setShowPlanoAcaoCorretiva(true);
                  updateElaboration();
                  return;
                }
              }}
            >
              Avançar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralRegister;
