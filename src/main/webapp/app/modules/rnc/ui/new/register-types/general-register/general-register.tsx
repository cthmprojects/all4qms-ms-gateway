import {
  Breadcrumbs,
  Button,
  Card,
  FormControl,
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
import { Action, ActionPlan, IshikawaInvestigation, ReasonsInvestigation, Rnc } from 'app/modules/rnc/models';
import {
  saveEffectCause,
  saveImmediateAction,
  saveRange,
  saveReason,
  getById,
  update,
  saveInvestigation,
  updateEffectCause,
  updateReason,
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
import { rangeList } from 'app/modules/rnc/reducers/range.reducer';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Storage } from 'react-jhipster';
import { getImmediateActionByRnc, removeImmediateAction } from 'app/modules/rnc/reducers/immediate-action.reducer';
import { getInvestigationByRnc } from 'app/modules/rnc/reducers/investigation.reducer';
import { getDescriptionByRNCId } from 'app/modules/rnc/reducers/description.reducer';

export const GeneralRegister = () => {
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
      editable: true,
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

  const [newGeneralRegister, setNewGeneralRegister] = useState(true);

  /*
   * Immediate action
   */
  const [actions, setActions] = useState<Array<Action>>([]);

  /*
   * Cause investigation
   */
  const [ishikawaInvestigation, setIshikawaInvestigation] = useState<IshikawaInvestigation>();
  const [reasonsInvestigation, setReasonsInvestigation] = useState<ReasonsInvestigation>();

  const [responsaveisMP, setResponsaveisMP] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [listaAcoesCorretivas, setListaAcoesCorretivas] = useState<Array<ActionPlan>>([]);
  const [checkedIshikawa, setCheckedIshikawa] = useState(false);
  const [checkedFiveWhy, setCheckedFiveWhy] = useState(false);
  const [showPlanoAcaoCorretiva, setShowPlanoAcaoCorretiva] = useState(false);
  const [newIshikawa, setNewIshikawa] = useState(true);
  const [newFiveWhy, setNewFiveWhy] = useState(true);
  const [ishikawaId, setIshikawaId] = useState(null);
  const [reasonId, setReasonId] = useState(null);

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());

    if (id) {
      dispatch(getById(parseInt(id)));
      dispatch(getDescriptionByRNCId(id));

      loadImmediateActions();
      getInvestigationByRnc(id).then(res => {
        if (res.ishikawa !== null) {
          setCheckedIshikawa(true);
          setNewIshikawa(false);
          setIshikawaId(res.ishikawa.id);
          setIshikawaInvestigation({
            environment: res.ishikawa?.meioAmbiente.length > 0 ? res.ishikawa?.meioAmbiente.split(';') : [],
            machine: res.ishikawa?.maquina.lenght > 0 ? res.ishikawa?.maquina.split(';') : [],
            measurement: res.ishikawa?.medicao.lenght > 0 ? res.ishikawa?.medicao.split(';') : [],
            method: res.ishikawa?.metodo.lenght > 0 ? res.ishikawa?.metodo.split(';') : [],
            rawMaterial: res.ishikawa?.materiaPrima.length > 0 ? res.ishikawa?.materiaPrima.split(';') : [],
            manpower: res.ishikawa?.maoDeObra.length > 0 ? res.ishikawa?.maoDeObra.split(';') : [],
          });
        }

        if (res.porques) {
          setReasonId(res.porques.id);
          setNewFiveWhy(false);
          setCheckedFiveWhy(true);
          setReasonsInvestigation({
            first: res.porques.pq1,
            second: res.porques.pq2,
            third: res.porques.pq3,
            fourth: res.porques.pq4,
            fifth: res.porques.pq5,
          });
        }
      });
    }

    rangeList(id).then(data => {
      if (data) {
        let keylist = registerForm.keywords.value;
        data.descricaoAbrangencia.split(';').map((keywordReturned: string) => {
          keylist.push(keywordReturned);
        });

        setRegisterForm({
          ...registerForm,
          keywords: {
            value: keylist,
            error: registerForm.keywords.error,
            editable: false,
          },
        });

        setNewGeneralRegister(false);
      }
    });
  }, []);

  const onActionAdded = (action: Action): void => {
    const jhipsterId = Storage.session.get('ID_USUARIO');
    const userId = users.find(user => user.user.id === jhipsterId);

    dispatch(
      saveImmediateAction({
        deadline: action.deadline,
        description: action.description,
        problem: '',
        responsibleId: filterUser(action.responsible)?.id,
        rncId: _rnc.id,
        status: action.status,
        validated: false,
        verifierId: userId,
      })
    ).then(() => {
      loadImmediateActions();
    });
  };

  const onActionRemoved = (action: Action): void => {
    const idx = actions.indexOf(action);

    if (idx < 0) {
      return;
    }

    removeImmediateAction(action.id)
      .then(() => {
        loadImmediateActions();
        toast.success('Ação imediata removida com sucesso!');
      })
      .catch(() => {
        toast.error('Erro ao remover ação imediata!');
      });
  };

  const onIshikawaInvestigationChanged = (investigation: IshikawaInvestigation): void => {
    setIshikawaInvestigation(investigation);
  };

  const onReasonsInvestigationChanged = (investigation: ReasonsInvestigation): void => {
    setReasonsInvestigation(investigation);
  };

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

  const handleChange = (value: any) => {
    setRegisterForm(value);
  };

  const onActionPlansUpdated = (actionPlans: Array<ActionPlan>): void => {
    setListaAcoesCorretivas(actionPlans);
  };

  const renderListaAcoesCorretivas = () => {
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
        <Select label="Responsável" name="forwarded" value={responsavel} disabled>
          {users.map((user, i) => (
            <MenuItem value={user.login} key={`user-${i}`}>
              {user.login}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ));
  };

  const loadImmediateActions = () => {
    getImmediateActionByRnc(id).then(res => {
      const _actions = [];
      res.map((action: any) => {
        _actions.push({
          id: action.id,
          description: action.descricaoAcaoImediata,
          deadline: new Date(action.prazoAcaoImediata),
          responsible: users.find(user => user.id === action.idResponsavelAcaoImediata)?.nome,
          status: action.statusAcaoImediata,
        });
      });
      setActions(_actions);
    });
  };

  const valid5why = () => {
    let counter = 0;

    if (reasonsInvestigation.first) {
      counter++;
    }

    if (reasonsInvestigation.second) {
      counter++;
    }

    if (reasonsInvestigation.third) {
      counter++;
    }

    if (reasonsInvestigation.fourth) {
      counter++;
    }

    if (reasonsInvestigation.fifth) {
      counter++;
    }

    if (counter < 3) return false;

    return true;
  };

  const validIshikawa = () => {
    let counter = 0;

    if (ishikawaInvestigation.environment.length > 0) {
      counter++;
    }

    if (ishikawaInvestigation.machine.length > 0) {
      counter++;
    }

    if (ishikawaInvestigation.measurement.length > 0) {
      counter++;
    }

    if (ishikawaInvestigation.method.length > 0) {
      counter++;
    }

    if (ishikawaInvestigation.rawMaterial.length > 0) {
      counter++;
    }

    if (ishikawaInvestigation.manpower.length > 0) {
      counter++;
    }

    if (counter < 1) return false;

    return true;
  };

  const saveOrUpdate = () => {
    // if(!newGeneralRegister) {
    //   return;
    // }

    if (!checkedFiveWhy && !checkedIshikawa) {
      toast.error('Você deve preencher ao menos um campo de investigação de causas para continuar');
      return;
    }

    if (checkedIshikawa && !validIshikawa()) {
      toast.error('Você deve preencher ao menos um campo do Ishikawa para continuar');
      return;
    }
    if (checkedFiveWhy && !valid5why()) {
      toast.error('Você deve preencher ao menos três campos dos 5 porquês para continuar');
      return;
    }

    // ambrangencia
    // ação imediata
    //
    if (registerForm.keywords.editable) {
      dispatch(saveRange({ description: registerForm.keywords.value.join(';'), rncId: _rnc.id })).then(() => {
        setRegisterForm({
          ...registerForm,
          keywords: {
            value: registerForm.keywords.value,
            error: registerForm.keywords.error,
            editable: false,
          },
        });
      });
    }

    if (_rnc && !showPlanoAcaoCorretiva) {
      if (newIshikawa && newFiveWhy) {
        saveInvestigation(
          id,
          {
            description: descriptionEntity?.detalhesNaoConformidade,
            environment: ishikawaInvestigation?.environment.join(';'),
            machine: ishikawaInvestigation?.machine.join(';'),
            measurement: ishikawaInvestigation?.measurement.join(';'),
            method: ishikawaInvestigation?.method.join(';'),
            rawMaterial: ishikawaInvestigation?.rawMaterial.join(';'),
            workforce: ishikawaInvestigation?.manpower.join(';'),
          },
          {
            cause: descriptionEntity?.detalhesNaoConformidade,
            fifth: reasonsInvestigation?.fifth,
            first: reasonsInvestigation?.first,
            forth: reasonsInvestigation?.fourth,
            problem: descriptionEntity?.detalhesNaoConformidade,
            second: reasonsInvestigation?.second,
            third: reasonsInvestigation?.third,
          }
        ).then(() => {});
      }

      if (!newIshikawa && checkedIshikawa) {
        updateEffectCause(ishikawaId, {
          description: descriptionEntity?.detalhesNaoConformidade,
          environment: ishikawaInvestigation?.environment.join(';'),
          machine: ishikawaInvestigation?.machine.join(';'),
          measurement: ishikawaInvestigation?.measurement.join(';'),
          method: ishikawaInvestigation?.method.join(';'),
          rawMaterial: ishikawaInvestigation?.rawMaterial.join(';'),
          workforce: ishikawaInvestigation?.manpower.join(';'),
        });
      }

      if (!newFiveWhy && checkedFiveWhy) {
        updateReason(reasonId, {
          cause: descriptionEntity?.detalhesNaoConformidade,
          fifth: reasonsInvestigation?.fifth,
          first: reasonsInvestigation?.first,
          forth: reasonsInvestigation?.fourth,
          problem: descriptionEntity?.detalhesNaoConformidade,
          second: reasonsInvestigation?.second,
          third: reasonsInvestigation?.third,
        });
      }
      // dispatch(
      //   savePlan({
      //     actionPlans: listaAcoesCorretivas,
      //     plan: {
      //       dtConclusaoPlano: new Date(),
      //       idNaoConformidade: _rnc.id,
      //       percentualPlano: 0,
      //       qtdAcoes: listaAcoesCorretivas.length,
      //       qtdAcoesConcluidas: 0,
      //       statusPlano: 'ABERTO',
      //     },
      //   })
      // );
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
      navigate('/rnc');
    }
  };

  const setTitleMPOrigin = () => {
    if (_rnc.origemNC === 'MATERIA_PRIMA_INSUMO') {
      return 'Decisão sobre Matéria-Prima/Insumo';
    } else if (_rnc.origemNC === 'PRODUTO_ACABADO') {
      return 'Decisão sobre Produto Acabado';
    }
  };

  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);

  useEffect(() => {
    if (id) {
      loadImmediateActions();
    }
  }, [users]);

  const filterUser = (username: string) => {
    if (!users || users.length <= 0) {
      return null;
    }

    return users.find(user => user.nome === username);
  };

  const _rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);
  const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);
  const descriptionEntity = useAppSelector(state => state.all4qmsmsgateway.description.entity);

  useEffect(() => {
    if (_rnc?.statusAtual == 'ELABORACAO') {
      setShowPlanoAcaoCorretiva(true);
    }
  }, [_rnc]);

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
          {/* Análise de Abrangência NC */}
          <ScopeAnalysis
            disabled={!registerForm.keywords.editable}
            keywords={registerForm.keywords.value}
            onChanged={newKeyWords =>
              handleChange({
                ...registerForm,
                keywords: {
                  value: newKeyWords,
                  error: registerForm.keywords.error,
                  editable: registerForm.keywords.editable,
                },
              })
            }
          />

          {/* Ação imediata enums.immediateActionTypes*/}
          <ImmediateActions actions={actions} onAdded={onActionAdded} onRemoved={onActionRemoved} users={users.map(u => u.nome)} />

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
            description={descriptionEntity?.detalhesNaoConformidade}
            onIshikawaInvestigationChanged={onIshikawaInvestigationChanged}
            onReasonsInvestigationChanged={onReasonsInvestigationChanged}
            checkIshikawa={setCheckedIshikawa}
            checkReasons={setCheckedFiveWhy}
            checkedIshikawa={checkedIshikawa}
            checkedReasons={checkedFiveWhy}
            ishikawa={ishikawaInvestigation}
            reasons={reasonsInvestigation}
            newIshikawa={newIshikawa}
            newReasons={newFiveWhy}
          />

          {showPlanoAcaoCorretiva && <div className="fake-card mt-2">{renderListaAcoesCorretivas()}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => navigate('/rnc')}
            >
              Voltar
            </Button>
            <Button onClick={() => saveOrUpdate()}>Salvar</Button>

            <Button
              className="ms-3"
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
              onClick={() => {
                if (!showPlanoAcaoCorretiva) {
                  setShowPlanoAcaoCorretiva(true);
                  updateElaboration();
                } else {
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
                  updateInvestigation();
                  navigate('/rnc');
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
