import { Breadcrumbs, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Action, ActionPlan, IshikawaInvestigation, Plan, ReasonsInvestigation, Rnc } from 'app/modules/rnc/models';
import { Decision } from 'app/modules/rnc/models/decision';
import { deleteDecision, findDecisionByRnc, getDecisions, saveDecision, updateDecision } from 'app/modules/rnc/reducers/decision.reducer';
import { getDescriptionByRNCId } from 'app/modules/rnc/reducers/description.reducer';
import { deleteEffectCause } from 'app/modules/rnc/reducers/effect-cause.reducer';
import { getImmediateActionByRnc, removeImmediateAction } from 'app/modules/rnc/reducers/immediate-action.reducer';
import {
  deleteInvestigation,
  getInvestigationByRnc,
  getInvestigations,
  getPlanoByRnc,
} from 'app/modules/rnc/reducers/investigation.reducer';
import { formatDate, savePlan, updatePlan } from 'app/modules/rnc/reducers/plan.reducer';
import { rangeList } from 'app/modules/rnc/reducers/range.reducer';
import { deleteReason } from 'app/modules/rnc/reducers/reason.reducer';
import { getById, saveImmediateAction, saveInvestigation, saveRange, update } from 'app/modules/rnc/reducers/rnc.reducer';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Storage } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row } from 'reactstrap';
import { Enums } from '../../../../models';
import { listEnums } from '../../../../reducers/enums.reducer';
import { CauseInvestigation, ImmediateActions, PlannedActions, ProductDecisions, ScopeAnalysis } from '../../../components';
import './general-register.css';

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

const getUsersSGQ = () => {
  let url = '/api/admin/users-by-role?role=ROLE_SGQ';

  return axios.get(url);
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
  const [reasonsInvestigations, setReasonsInvestigations] = useState<Array<ReasonsInvestigation>>([]);

  /*
   * Decision
   */
  const [decisions, setDecisions] = useState<Array<Decision>>([]);
  const [readonlyDecision, setReadonlyDecision] = useState<boolean>(false);

  const [responsaveisMP, setResponsaveisMP] = useState<Array<string>>([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [plans, setPlans] = useState<Array<Plan>>([]);
  const [listaAcoesCorretivas, setListaAcoesCorretivas] = useState<Array<ActionPlan>>([]);
  const [checkedIshikawa, setCheckedIshikawa] = useState(true);
  const [checkedFiveWhy, setCheckedFiveWhy] = useState(true);
  const [showPlanoAcaoCorretiva, setShowPlanoAcaoCorretiva] = useState(false);
  const [newIshikawa, setNewIshikawa] = useState(true);
  const [newFiveWhy, setNewFiveWhy] = useState(true);
  const [ishikawaId, setIshikawaId] = useState(null);
  const [reasonIds, setReasonIds] = useState<Array<number>>([]);

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listEnums());

    if (id) {
      dispatch(getById(parseInt(id)));
      dispatch(getDescriptionByRNCId(id));
      dispatch(findDecisionByRnc(id));

      loadImmediateActions();

      getPlanoByRnc(id).then(res => {
        if (res.length > 0) {
          setShowPlanoAcaoCorretiva(true);
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
                dataVerificao: action?.dataVerificao ? new Date(action?.dataVerificao) : null,
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

  const onReasonsInvestigationsChanged = (investigations: Array<ReasonsInvestigation>): void => {
    setReasonsInvestigations(investigations);
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
        dispatch(update({ ..._rnc, statusAtual: 'EXECUCAO' })).then(() => navigate('/rnc'));
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
    for (let i = 0; i < reasonsInvestigations.length; i++) {
      const reasonsInvestigation = reasonsInvestigations[i];

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
    }

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

  const saveOrUpdate = async (): Promise<void> => {
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

    if (_rnc) {
      const allInvestigations = await getInvestigations();

      const ids: Array<number> = allInvestigations.filter(i => i.idNaoConformidade === _rnc.id).map(i => i.id);

      for (let i = 0; i < ids.length; i++) {
        const id: number = ids[i];
        await deleteInvestigation(id);
      }

      const currentInvestigations = await getInvestigationByRnc(id);

      for (let i = 0; i < currentInvestigations.length; i++) {
        const currentInvestigation = currentInvestigations[i];

        const ishikawa = currentInvestigation.ishikawa;
        const reasons = currentInvestigation.porques;

        if (ishikawa) {
          const id: number = ishikawa.id;

          await deleteEffectCause(id);
        }

        if (reasons && reasons.length > 0) {
          for (let i = 0; i < reasons.length; i++) {
            const id: number = reasons[i].id;

            await deleteReason(id);
          }
        }
      }

      for (let i = 0; i < reasonsInvestigations.length; i++) {
        const reasonInvestigation: ReasonsInvestigation = reasonsInvestigations[i];
        await saveInvestigation(id, null, {
          cause: reasonInvestigation?.cause,
          fifth: reasonInvestigation?.fifth,
          first: reasonInvestigation?.first,
          forth: reasonInvestigation?.fourth,
          problem: descriptionEntity?.detalhesNaoConformidade,
          second: reasonInvestigation?.second,
          third: reasonInvestigation?.third,
        });
      }

      await saveInvestigation(
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

    if (_rnc && showPlanoAcaoCorretiva) {
      if (plans.length > 0) {
        dispatch(
          updatePlan({
            actionPlans: listaAcoesCorretivas,
            plan: plans[0],
          })
        ).then(() => {
          sendNotifications();
        });

        toast.success('RNC atualizada com sucesso!');
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
        ).then(() => {
          sendNotifications();
        });
      }
    }
  };

  const getDecisionTitle = (): string => {
    if (_rnc.origemNC === 'MATERIA_PRIMA_INSUMO') {
      return 'Decisão sobre Matéria-Prima/Insumo';
    } else if (_rnc.origemNC === 'PRODUTO_ACABADO') {
      return 'Decisão sobre Produto Acabado';
    }
  };

  const onDecisionsChanged = (decisions: Array<Decision>): void => {
    setDecisions(decisions);
  };

  const saveProductDecision = (): void => {
    if (!decisions || decisions.length <= 0) {
      return;
    }

    getDecisions(id).then(async res => {
      const existingDecisions = res;

      for (let i = 0; i < existingDecisions.length; i++) {
        const id: number = existingDecisions[i].id;

        await deleteDecision(id);
      }

      for (let i = 0; i < decisions.length; i++) {
        const decision: Decision = decisions[i];
        decision.rncId = _rnc.id;
        dispatch(saveDecision(decision));
      }
    });
  };

  const sendNotificationToSGQs = async () => {
    getUsersSGQ().then(r => {
      let _users = r.data;
      _users.forEach(element => {
        let sgq = users.find(user => user.user.id == element.id);
        sendNotification('Existe uma pendência no módulo RNC', sgq);
      });
    });
  };

  const sendNotifications = async () => {
    let url = '/api/pendencias';
    let urlEmail = '/services/all4qmsmsinfodoc/api/infodoc/notificacoes/enviar-email';

    listaAcoesCorretivas.map(async e => {
      let _user = users.find(user => user.id == e.idResponsavelAcao);
      let _currentUser = JSON.parse(Storage.session.get('USUARIO_QMS'));

      await axios.post(url, {
        nome: `Pendência no módulo RNC. Descrição: ${e.descricaoAcao} - Prazo: ${formatDate(e.prazoAcao, true)}`,
        status: false,
        tipo: 'ATIVIDADE',
        responsavel: _user,
        link: `/rnc/general/${id}`,
      });

      await axios
        .post(urlEmail, {
          to: _user.email,
          subject: 'Pendência no módulo RNC',
          tipo: 'APROVAR',
          tituloDocumento: '-',
          nomeEmissor: _currentUser.nome,
          dataCriacao: formatDate(new Date(), true),
          descricao: `Pendência no módulo RNC. Descrição: ${e.descricaoAcao} - Prazo: ${formatDate(e.prazoAcao, true)}`,
          motivoReprovacao: '-',
        })
        .catch(e => {
          toast.error('Não foi possível notificar responsáveis por e-mail');
        });
    });
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
  const decisionEntities = useAppSelector(state => state.all4qmsmsgateway.decision.entities);

  useEffect(() => {
    setDecisions(
      decisionEntities.map(decision => {
        return {
          approved: decision.qtdAprovada,
          createdAt: decision.criadoEm,
          current: decision.qtdAtual,
          date: decision.dataDecisao,
          decisionId: decision.idDecisaoAtual,
          description: decision.descricaoDecisao,
          id: decision.id,
          rejected: decision.qtdRejeitada,
          reproved: decision.qtdReprovada,
          responsibles: decision.responsaveis,
          rncId: decision.idNaoConformidade,
          type: decision.tipoDecisao,
          updatedAt: decision.atualizadoEm,
        };
      })
    );
  }, [decisionEntities]);

  const getDecisionInitialData = useMemo((): Decision | null => {
    if (!decisionEntity || decisionEntity.length <= 0) {
      return null;
    }

    const data = decisionEntity.length > 0 ? decisionEntity[0] : decisionEntity;
    // setReadonlyDecision(true);

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

  useEffect(() => {
    if (!_rnc) {
      return;
    }

    getInvestigationByRnc(id).then(res => {
      if (res.ishikawa) {
        setCheckedIshikawa(true);
        // setNewIshikawa(false);
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

      if (res.porques && res.porques.length > 0) {
        const allReasons: Array<any> = res.porques;
        const allReasonInvestigations: Array<ReasonsInvestigation> = [];
        const allReasonIds: Array<number> = [];

        // setNewFiveWhy(false);
        setCheckedFiveWhy(true);

        for (let i = 0; i < allReasons.length; i++) {
          const currentReason = allReasons[i];

          allReasonIds.push(currentReason.id);
          allReasonInvestigations.push({
            first: currentReason.pq1,
            second: currentReason.pq2,
            third: currentReason.pq3,
            fourth: currentReason.pq4,
            fifth: currentReason.pq5,
            cause: currentReason.descCausa,
          });
        }

        setReasonIds(allReasonIds);
        setReasonsInvestigations(allReasonInvestigations);
      } else {
        const allReasonInvestigations: Array<ReasonsInvestigation> = [];

        for (let i = 0; i < _rnc.qtdPorques; i++) {
          allReasonInvestigations.push({
            fifth: '',
            first: '',
            fourth: '',
            second: '',
            third: '',
            cause: '',
          });
        }

        setReasonsInvestigations(allReasonInvestigations);
      }
    });
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
            <>
              <ProductDecisions
                allowAdding={_rnc?.origemNC == 'MATERIA_PRIMA_INSUMO'}
                decisions={decisions}
                onChanged={onDecisionsChanged}
                readonly={readonlyDecision}
                title={getDecisionTitle()}
                users={users.map(u => u.nome)}
              />
            </>
          )}

          <CauseInvestigation
            description={descriptionEntity?.detalhesNaoConformidade}
            onIshikawaInvestigationChanged={onIshikawaInvestigationChanged}
            onReasonsInvestigationsChanged={onReasonsInvestigationsChanged}
            checkIshikawa={setCheckedIshikawa}
            checkReasons={setCheckedFiveWhy}
            checkedIshikawa={checkedIshikawa}
            checkedReasons={checkedFiveWhy}
            ishikawa={ishikawaInvestigation}
            reasons={reasonsInvestigations}
            newIshikawa={newIshikawa}
            newReasons={newFiveWhy}
            minimumReasons={_rnc?.qtdPorques ?? 0}
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
                saveOrUpdate();
                if (!showPlanoAcaoCorretiva) {
                  setShowPlanoAcaoCorretiva(true);
                  updateElaboration();
                } else {
                  sendNotificationToSGQs();
                  if (plans.length === 0) {
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
                  updateElaboration();
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
