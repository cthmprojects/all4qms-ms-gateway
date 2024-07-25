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
import { Action, ActionPlan, IshikawaInvestigation, Plan, ReasonsInvestigation, Rnc } from 'app/modules/rnc/models';
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row } from 'reactstrap';
import { CauseInvestigation, ImmediateActions, PlannedActions, ProductDecision, ScopeAnalysis } from '../../../components';
import './general-register.css';
import { listEnums } from '../../../../reducers/enums.reducer';
import { Enums } from '../../../../models';
import { savePlan, updatePlan } from 'app/modules/rnc/reducers/plan.reducer';
import { rangeList } from 'app/modules/rnc/reducers/range.reducer';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Storage } from 'react-jhipster';
import { getImmediateActionByRnc, removeImmediateAction } from 'app/modules/rnc/reducers/immediate-action.reducer';
import { getInvestigationByRnc, getPlanoByRnc } from 'app/modules/rnc/reducers/investigation.reducer';
import { getDescriptionByRNCId } from 'app/modules/rnc/reducers/description.reducer';
import { Decision } from 'app/modules/rnc/models/decision';
import { findDecisionByRnc, saveDecision } from 'app/modules/rnc/reducers/decision.reducer';
import axios from 'axios';

const sendNotification = async (title: string, user: any) => {
  let url = '/api/pendencias';
  await axios.post(url, {
    nome: title,
    status: false,
    tipo: 'ATIVIDADE',
    responsavel: user,
    link: '/rnc',
  });
};

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

  /*
   * Decision
   */
  const [decision, setDecision] = useState<Decision | null>();
  const [readonlyDecision, setReadonlyDecision] = useState<boolean>(false);

  const [responsaveisMP, setResponsaveisMP] = useState<Array<string>>([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [plans, setPlans] = useState<Array<Plan>>([]);
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
      dispatch(findDecisionByRnc(id));

      loadImmediateActions();
      getInvestigationByRnc(id).then(res => {
        if (res.ishikawa) {
          setCheckedIshikawa(true);
          setNewIshikawa(false);
          setIshikawaId(res.ishikawa.id);
          setIshikawaInvestigation({
            environment: res.ishikawa?.meioAmbiente.length > 0 ? res.ishikawa?.meioAmbiente.split(';') : [],
            machine: res.ishikawa?.maquina.length > 0 ? res.ishikawa?.maquina.split(';') : [],
            measurement: res.ishikawa?.medicao.length > 0 ? res.ishikawa?.medicao.split(';') : [],
            method: res.ishikawa?.metodo.length > 0 ? res.ishikawa?.metodo.split(';') : [],
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
            cause: res.porques.descCausa,
          });
        }
      });

      getPlanoByRnc(id).then(res => {
        if (res.length > 0) {
          setShowPlanoAcaoCorretiva(true);
          console.log('plans', res);
          const actionPlans = res;
          const newActions = [];
          const newPlans = [];
          for (let i = 0; i < actionPlans.length; i++) {
            const actions = actionPlans[i].acoes;
            const plan = actionPlans[i].plano;
            newPlans.push(plan);
            for (let j = 0; j < actions.length; j++) {
              const action = actions[j];
              newActions.push({
                id: action?.id,
                idPlano: action?.idPlano,
                descricaoAcao: action?.descricaoAcao,
                prazoAcao: new Date(action?.prazoAcao) || new Date(),
                idResponsavelAcao: action?.idResponsavelAcao,
                statusAcao: action?.statusAcao,
                dataVerificao: new Date(action?.dataVerificao) || new Date(),
                idResponsavelVerificaoAcao: action?.idResponsavelVerificaoAcao,
                idAnexosExecucao: action?.idAnexosExecucao,
                dataConclusaoAcao: new Date(action?.dataConclusaoAcao) || new Date(),
                criadoEm: action?.criadoEm,
                atualizadoEm: action?.atualizadoEm,
                planoId: action?.planoId,
              });
            }
          }
          setPlans(newPlans);
          setListaAcoesCorretivas(newActions);
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
        verifierId: userId?.id,
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

  const updateElaboration = () => {
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
    console.log('lista', listaAcoesCorretivas);

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

    saveProductDecision();

    if (_rnc && !showPlanoAcaoCorretiva) {
      if (newIshikawa && newFiveWhy) {
        if (checkedIshikawa && !checkedFiveWhy) {
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
            null
          );
        }
        if (checkedFiveWhy && !checkedIshikawa) {
          saveInvestigation(id, null, {
            cause: reasonsInvestigation?.cause,
            fifth: reasonsInvestigation?.fifth,
            first: reasonsInvestigation?.first,
            forth: reasonsInvestigation?.fourth,
            problem: descriptionEntity?.detalhesNaoConformidade,
            second: reasonsInvestigation?.second,
            third: reasonsInvestigation?.third,
          });
        }

        if (checkedFiveWhy && checkedIshikawa) {
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
              cause: reasonsInvestigation?.cause,
              fifth: reasonsInvestigation?.fifth,
              first: reasonsInvestigation?.first,
              forth: reasonsInvestigation?.fourth,
              problem: descriptionEntity?.detalhesNaoConformidade,
              second: reasonsInvestigation?.second,
              third: reasonsInvestigation?.third,
            }
          ).then(() => {});
        }
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
      if (plans.length > 0) {
        console.log('plan', plans[0]);
        dispatch(
          updatePlan({
            actionPlans: listaAcoesCorretivas,
            plan: plans[0],
          })
        );
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
      }
      navigate('/rnc');
    }
  };

  const getDecisionTitle = (): string => {
    if (_rnc.origemNC === 'MATERIA_PRIMA_INSUMO') {
      return 'Decisão sobre Matéria-Prima/Insumo';
    } else if (_rnc.origemNC === 'PRODUTO_ACABADO') {
      return 'Decisão sobre Produto Acabado';
    }
  };

  const onDecisionChanged = (decision: Decision): void => {
    setDecision(decision);
  };

  const saveProductDecision = (): void => {
    if (!decision) {
      return;
    }

    decision.rncId = _rnc.id;

    dispatch(saveDecision(decision));
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
  const decisionEntity = useAppSelector(state => state.all4qmsmsgateway.decision.entity);

  const getDecisionInitialData = useMemo((): Decision | null => {
    if (!decisionEntity || decisionEntity.length <= 0) {
      return null;
    }

    const data = decisionEntity.length > 0 ? decisionEntity[0] : decisionEntity;
    setReadonlyDecision(true);

    const decision: Decision = {
      approved: data.qtdAprovada,
      current: data.qtdAtual,
      date: new Date(data.dataDecisao),
      description: data.descricaoDecisao,
      rejected: data.qtdRejeitada,
      reproved: data.qtdReprovada,
      responsibles: data.responsaveis,
      rncId: data.idNaoConformidade,
      type: data.tipoDecisao.toLowerCase(),
    };

    return decision;
  }, [decisionEntity]);

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
            description={descriptionEntity?.detalhesNaoConformidade}
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
            <ProductDecision
              initialData={getDecisionInitialData}
              onChanged={onDecisionChanged}
              readonly={readonlyDecision}
              title={getDecisionTitle()}
              users={users.map(u => u.nome)}
            />
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
                  updateElaboration();
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
