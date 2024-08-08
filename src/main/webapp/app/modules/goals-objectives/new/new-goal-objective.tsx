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
import axios from 'axios';
import { createGoals } from '../reducers/targets';
import { TargetGoals } from '../models/goals';
import { Storage } from 'react-jhipster';

const StyledLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  top: 'calc((var(--Textarea-minHeight) - 1em) / 2)',
  color: theme.vars.palette.text.tertiary,
  fontWeight: 400,
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const QualityPolicy = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Política de Qualidade</StyledLabel>
    </React.Fragment>
  );
});

const QualityPolicyDevelopment = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(
  props,
  ref
) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Desdobramento da Política de Qualidade</StyledLabel>
    </React.Fragment>
  );
});

const QualityTargets = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Objetivos de Qualidade</StyledLabel>
    </React.Fragment>
  );
});

const GoalDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Descrição da meta</StyledLabel>
    </React.Fragment>
  );
});

const GoalIndicators = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Indicadores</StyledLabel>
    </React.Fragment>
  );
});

const GoalMeasurement = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Medição</StyledLabel>
    </React.Fragment>
  );
});

const GoalAction = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Ações</StyledLabel>
    </React.Fragment>
  );
});

const ResultEvaluation = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={4} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Avaliação do resultado</StyledLabel>
    </React.Fragment>
  );
});

const getProcesses = async () => {
  const apiUrl = 'services/all4qmsmsgateway/api/processos';
  const response = await axios.get(`${apiUrl}`);
  return response.data;
};

export const NewGoalObjective = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [emitter, setEmitter] = useState('');
  const [emittedDate, setEmittedDate] = useState(new Date());

  const [innerTextQP, setQP] = useState('');
  const [innerTextQT, setQT] = useState('');
  const [innerTextQPD, setQPD] = useState('');
  const [targetDescription, setTargetDescription] = useState('');
  const [indicatorText, setIndicatorText] = useState('');
  const [measurementText, setMeasurementText] = useState('');
  const [actionText, setActionText] = useState('');
  const [resultEvaluation, setResultEvaluation] = useState('');

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
  const [targetGoalsId, setTargetGoalsId] = useState(0);
  const [keywordList, setKeywordList] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [goals, setGoals] = useState([{ id: Date.now() }]);

  useEffect(() => {
    // dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    // dispatch(listEnums());
    // dispatch(getInfoDocById(id));

    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        setSelectedProcess(data[0].id);
      }
    });
  }, []);

  const cancelNewGoal = () => {
    navigate('/goals');
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

  const addNewGoal = () => {
    setGoals([...goals, { id: Date.now() }]);
  };

  const validateFields = () => {
    return emitter && emittedDate && documentDescription && code && title && selectedProcess;
  };

  const saveTargetGoals = () => {
    const newTargetGoals: TargetGoals = {
      idUsuarioCriacao: parseInt(emitter, 10),
      dataCricao: JSON.stringify(emittedDate),
      qp: innerTextQP,
      qpd: innerTextQPD,
      qt: innerTextQT,
      goals: [
        {
          id: goals[0].id,
        },
      ],
    };
    // if (!noValidate) {
    //   newTargetGoals.ignorarValidade = false;
    //   newTargetGoals.dataValidade = validDate;
    // }
    // dispatch(createNewGoal(newTargetGoals)).then((res: any) => {
    //   setTargetGoalsId(parseInt(res.payload.data?.doc?.id));
    //   setInfoDocMovimentacao(parseInt(res.payload.data?.movimentacao?.id));
    // });
  };

  // const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  // const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);

  // useEffect(() => {
  //   setOriginList(enums?.origem);

  //   if (enums?.origem.length > 0) {
  //     setOrigin(enums.origem[0].nome);
  //   }
  // }, [enums]);

  return (
    <div>
      {/* Indicador */}
      <div
        className="ms-5 me-5 pb-1 mb-1 mt-5"
        style={{
          background: '#fff',
          paddingBottom: '0!important',
          boxShadow: '0 2px 1px -1px rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(0, 0, 0, 0.12)',
        }}
      >
        <Row className="justify-content-center mt-0">
          <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Link to={'/goals'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Metas e Objetivos
            </Link>
            <Link to={'/goals/new'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Cadastrar novo
            </Link>
          </Breadcrumbs>
        </Row>

        <div className="container-style ms-3" style={{ margin: '0', padding: '0 2rem 0!important 1rem' }}>
          <h1 className="mt-4" style={{ fontSize: '1.5rem', margin: '0 auto 1rem 0', padding: '0px' }}>
            Indicador
          </h1>
          <hr style={{ margin: '0 -1rem 1rem -2rem' }}></hr>
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1.5rem auto',
            }}
          >
            <Textarea
              className="w-100"
              slots={{ textarea: QualityPolicy }}
              slotProps={{
                textarea: {
                  placeholder: '',
                },
              }}
              sx={{ borderRadius: '6px', minHeight: '5rem' }}
              name="ncAreaA"
              value={innerTextQP || ''}
              onChange={e => setQP(e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1.5rem auto',
            }}
          >
            <Textarea
              className="w-100"
              slots={{ textarea: QualityPolicyDevelopment }}
              slotProps={{ textarea: { placeholder: '' } }}
              sx={{ borderRadius: '6px', minHeight: '5rem' }}
              name="ncAreaB"
              value={innerTextQPD || ''}
              onChange={f => setQPD(f.target.value)}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1.5rem auto',
            }}
          >
            <Textarea
              className="w-100"
              slots={{ textarea: QualityTargets }}
              slotProps={{ textarea: { placeholder: '' } }}
              sx={{ borderRadius: '6px', minHeight: '5rem' }}
              name="ncAreaC"
              value={innerTextQT || ''}
              onChange={g => setQT(g.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Metas */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '0',
          margin: '0',
          alignItems: 'flex-end',
        }}
      >
        {/* Campo de metas */}
        <div style={{ padding: '0', margin: '0', width: 'calc(100% - 8.5rem)' }}>
          {goals.map(goal => (
            <div
              key={goal.id}
              className="ms-5 me-5 pb-2 pt-2 mb-1 mt-5"
              style={{
                background: '#fff',
                width: '100%',
                boxShadow: '0 2px 1px -1px rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <div
                className="container-style mt-5 ms-3"
                style={{
                  margin: '0px',
                  padding: '0 2rem 1rem 1rem',
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: 'space-between',
                }}
              >
                <h1 className="mt-4" style={{ fontSize: '1.5rem', margin: '0 auto 0 0', padding: '0', width: '100%' }}>
                  Metas
                </h1>
                <hr
                  style={{
                    margin: '1rem -2rem',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'grey',
                    width: 'calc(100% + 4rem)',
                  }}
                ></hr>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'column',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'left',
                    margin: '1.5rem auto',
                  }}
                >
                  <Textarea
                    className="w-100"
                    slots={{ textarea: GoalDescription }}
                    slotProps={{ textarea: { placeholder: '' } }}
                    sx={{ borderRadius: '6px', minHeight: '5rem' }}
                    name="ncAreaA"
                    value={targetDescription || ''}
                    onChange={e => setQP(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'column',
                    width: '49%',
                    justifyContent: 'space-between',
                    alignItems: 'left',
                    margin: '1.5rem auto',
                  }}
                >
                  <Textarea
                    className="w-100"
                    slots={{ textarea: GoalIndicators }}
                    slotProps={{ textarea: { placeholder: '' } }}
                    sx={{ borderRadius: '6px', minHeight: '5rem' }}
                    name="ncAreaA"
                    value={indicatorText || ''}
                    onChange={e => setQP(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'row wrap',
                    width: '49%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '1.5rem auto',
                  }}
                >
                  <Textarea
                    className="w-100"
                    slots={{ textarea: GoalMeasurement }}
                    slotProps={{ textarea: { placeholder: '' } }}
                    sx={{ borderRadius: '6px', minHeight: '5rem' }}
                    name="ncAreaA"
                    value={measurementText || ''}
                    onChange={e => setQP(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'row wrap',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '1.5rem auto',
                  }}
                >
                  <Textarea
                    className="w-100"
                    slots={{ textarea: GoalAction }}
                    slotProps={{ textarea: { placeholder: '' } }}
                    sx={{ borderRadius: '6px', minHeight: '5rem' }}
                    name="ncAreaB"
                    value={actionText || ''}
                    onChange={f => setQPD(f.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'row wrap',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '1.5rem auto',
                  }}
                >
                  <Textarea
                    className="w-100"
                    slots={{ textarea: ResultEvaluation }}
                    slotProps={{ textarea: { placeholder: '' } }}
                    sx={{ borderRadius: '6px', minHeight: '5rem' }}
                    name="ncAreaC"
                    value={resultEvaluation || ''}
                    onChange={g => setQT(g.target.value)}
                  />
                </div>

                {/* DropDowns */}
                <div style={{ width: '24%' }}>
                  <FormControl sx={{ width: '100%' }} className="m-2">
                    <InputLabel>Processo</InputLabel>
                    <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)}>
                      {originList?.map(e => (
                        <MenuItem value={e.nome}>{e.valor}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ width: '24%' }}>
                  <FormControl sx={{ width: '100%' }} className="m-2">
                    <InputLabel>Recursos</InputLabel>
                    <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)}>
                      {originList?.map(e => (
                        <MenuItem value={e.nome}>{e.valor}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ width: '24%' }}>
                  <FormControl sx={{ width: '100%' }} className="m-2">
                    <InputLabel>Monitoramento</InputLabel>
                    <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)}>
                      {originList?.map(e => (
                        <MenuItem value={e.nome}>{e.valor}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ width: '24%' }}>
                  <FormControl sx={{ width: '100%' }} className="m-2">
                    <InputLabel>Avaliação</InputLabel>
                    <Select label="Origem" value={origin} onChange={event => setOrigin(event.target.value)}>
                      {originList?.map(e => (
                        <MenuItem value={e.nome}>{e.valor}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de adicionar metas */}
        <div
          className="mt-5"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 2rem 30rem auto',
            width: '3rem',
            height: '100%',
          }}
        >
          <Button
            onClick={addNewGoal}
            className="ms-3"
            variant="contained"
            color="primary"
            style={{
              background: '#E0E0E0',
              color: '#4e4d4d',
              borderRadius: '6rem',
              width: '3rem',
              height: '3rem',
              fontSize: '2rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            +
          </Button>
        </div>
      </div>

      {/* Botões de salvar ou cancelar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px', margin: '0 3rem 3rem auto' }} className="mt-5">
        <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => cancelNewGoal()}>
          Voltar
        </Button>
        <Button
          disabled={targetGoalsId <= 0}
          onClick={() => saveTargetGoals()}
          className="ms-3"
          variant="contained"
          color="primary"
          style={{ background: '#e6b200', color: '#4e4d4d' }}
        >
          SALVAR
        </Button>
      </div>
    </div>
  );
};

export default NewGoalObjective;
