import { Box, Breadcrumbs, Checkbox, Fab, FormControl, InputLabel, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { AxiosResponse } from 'axios';
import { Meta, MetaObjetivo, MetaRecurso } from '../../models/goals';
import { Process } from 'app/modules/rnc/models';
import { getAllResources } from '../../reducers/resources.reducer';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { EnumTemporal } from '../../models/enums';
import { saveMetaObjetivo } from '../../reducers/meta-objetivo.reducer';
import { getMeta, saveMetas, updateMeta } from '../../reducers/metas.reducer';

const initMeta = {
  descricao: '',
  acao: '',
  avaliacaoResultado: '',
  idProcesso: 0,
  monitoramento: EnumTemporal.MENSAL,
  periodo: EnumTemporal.MENSAL,
  recursos: [],
  metaObjetivo: {},
  monitoramentoControle: '',
  descricaoMonitoramentoControle: '',
};

export const NewGoalObjective = () => {
  const { metaId } = useParams();
  const location = useLocation();
  const propMeta: Meta = location.state as Meta;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const metaReducer: Meta = useAppSelector<Meta>(state => state.all4qmsmsmetaind.metas.entity);
  const resources: Array<MetaRecurso> = useAppSelector<Array<MetaRecurso>>(state => state.all4qmsmsmetaind.resources.entities);

  const [emitter, setEmitter] = useState('');
  const [emittedDate, setEmittedDate] = useState(new Date());

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  // const [processes, setProcesses] = useState([]);
  // const [resources, setResources] = useState([]);
  const [monitoring, setMonitoring] = useState<EnumTemporal[]>(Object.values(EnumTemporal));
  const [evaluation, setEvaluation] = useState<EnumTemporal[]>(Object.values(EnumTemporal));
  const [selectedProcess, setSelectedProcess] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [targetGoalsId, setTargetGoalsId] = useState(0);
  const [goals, setGoals] = useState<Array<Meta>>(/* propMeta ? [propMeta] :  */ [{ id: 0, ...initMeta }]);
  const [metaObj, setMetaObj] = useState<MetaObjetivo>({
    politicaSGQ: '',
    desdobramentoSGQ: '',
    objetivoSGQ: '',
  });

  const fetchGetMeta = async () => {
    const _resMeta = await dispatch(getMeta(Number(metaId)));
    const _meta: Meta = (_resMeta.payload as AxiosResponse).data;
    setGoals([{ ..._meta, recursos: _meta.recursos.map(res => JSON.stringify(res)) }]);
    setMetaObj(_meta.metaObjetivo);
  };

  useEffect(() => {
    dispatch(getProcesses());
    if (metaId) {
      fetchGetMeta();
    }
    dispatch(getAllResources({ page: 0, size: 20 }));
  }, []);

  const cancelNewGoal = () => {
    navigate('/goals');
  };

  const addNewGoal = () => {
    const _meta = { id: goals.length, ...initMeta };
    setGoals([...goals, _meta]);
  };

  const validateFields = () => {
    return emitter && emittedDate && documentDescription && code && title && selectedProcess;
  };

  const onChangeInputsMetas = (index, name: keyof typeof initMeta, value) => {
    let _goals = goals;
    _goals[index][name] = value;

    setGoals([..._goals]);
  };

  const saveGoalsObj = async () => {
    if (metaId) {
      const meta = goals[0];
      const _metaUpdate = { ...meta, recursos: meta.recursos.map(res => JSON.parse(res)), metaObjetivo: metaObj };
      const res = await dispatch(updateMeta(_metaUpdate));
      const _meta: Meta = (res.payload as AxiosResponse).data;
      // setGoals([_meta]);
    } else {
      const _resMetaObj = await dispatch(saveMetaObjetivo(metaObj));
      const _metaObj: MetaObjetivo = (_resMetaObj.payload as AxiosResponse).data;

      const _metas = goals.map(({ id, ...meta }) => ({
        ...meta,
        recursos: meta.recursos.map(res => JSON.parse(res)),
        metaObjetivo: _metaObj,
      }));
      const result = await dispatch(saveMetas(_metas));
      if (result) navigate(`/goals`); // setGoals([{ id: 0, ...initMeta }]);
    }
  };

  const line = <Box width="70%" borderTop="solid 1px" borderColor="#c6c5c5" margin="auto" />;

  return (
    <div>
      {/* Indicador */}
      <div
        className="ms-5 me-5 mt-5"
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
            <Link to={'/goals'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Metas e Objetivos
            </Link>
            <Link to={'/goals/new'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              {metaId ? `Editar Meta` : 'Cadastrar Meta'}
            </Link>
          </Breadcrumbs>
        </Row>

        <div className="container-style ms-3" style={{ margin: '0' }}>
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
              margin: '1rem auto',
            }}
          >
            <TextField
              multiline
              rows={3}
              fullWidth
              label="Política de Qualidade"
              name="ncAreaA"
              value={metaObj.politicaSGQ || ''}
              onChange={e => setMetaObj({ ...metaObj, politicaSGQ: e.target.value })}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1rem auto',
            }}
          >
            <TextField
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              label="Desdobramento da Política de Qualidade"
              name="ncAreaB"
              value={metaObj.desdobramentoSGQ || ''}
              onChange={e => setMetaObj({ ...metaObj, desdobramentoSGQ: e.target.value })}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1rem auto',
            }}
          >
            <TextField
              multiline
              rows={3}
              fullWidth
              label="Objetivos de Qualidade"
              value={metaObj.objetivoSGQ || ''}
              onChange={e => setMetaObj({ ...metaObj, objetivoSGQ: e.target.value })}
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
          position: 'relative',
        }}
      >
        <Fab
          onClick={addNewGoal}
          className="ms-3"
          color="primary"
          style={{
            background: '#E0E0E0',
            color: '#4e4d4d',
            borderRadius: '6rem',
            width: '3rem',
            height: '3rem',
            fontSize: '2rem',
            display: metaId ? 'none' : 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '18rem',
            right: '30px',
          }}
        >
          +
        </Fab>
        {/* Campo de metas */}
        <div style={{ padding: '0', margin: '0', width: 'calc(100% - 8.5rem)' }}>
          {goals
            .map((goal, index) => (
              <div
                key={index}
                className="ms-5 me-5 pb-2 mb-1 mt-3"
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
                  className="container-style mt-3 ms-3"
                  style={{
                    margin: '0px',
                    padding: '0 2rem 1rem 1rem',
                    display: 'flex',
                    flexFlow: 'row wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <h1 className="mt-1" style={{ fontSize: '1.5rem', margin: '0 auto 0 0', padding: '0', width: '100%' }}>
                    Meta {index + 1}
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
                  <Box display="flex" flexDirection="column" width="100%" gap="2.2rem">
                    <Box display="flex" flexDirection="column" width="100%" gap=".8rem">
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        label="Descrição da meta"
                        value={goal.descricao}
                        onChange={e => onChangeInputsMetas(index, 'descricao', e.target.value)}
                      />

                      <div style={{ width: '24%' }}>
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel>Processo</InputLabel>
                          <Select
                            label="Processo"
                            value={goal.idProcesso}
                            onChange={e => onChangeInputsMetas(index, 'idProcesso', e.target.value)}
                          >
                            {processes?.map((process, index) => (
                              <MenuItem key={index} value={process.id}>
                                {process.nome}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Box>

                    <Box display="flex" flexDirection="column" width="100%" gap=".8rem">
                      <TextField
                        fullWidth
                        label="Monitoramento / Controle"
                        value={goal.monitoramentoControle}
                        onChange={e => onChangeInputsMetas(index, 'monitoramentoControle', e.target.value)}
                      />

                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        label="Descrição Monitoramento / Controle"
                        value={goal.descricaoMonitoramentoControle || ''}
                        onChange={e => onChangeInputsMetas(index, 'descricaoMonitoramentoControle', e.target.value)}
                      />

                      <div style={{ width: '24%' }}>
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel>Frequência (Monitoramento / Controle)</InputLabel>
                          <Select
                            label="Frequência(Monitoramento / Controle)"
                            value={goal.monitoramento}
                            onChange={e => onChangeInputsMetas(index, 'monitoramento', e.target.value)}
                          >
                            {monitoring?.map((value, index) => (
                              <MenuItem key={index} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Box>

                    <Box display="flex" flexDirection="column" width="100%" gap=".8rem">
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        label="Ações Planejadas"
                        value={goal.acao || ''}
                        onChange={e => onChangeInputsMetas(index, 'acao', e.target.value)}
                      />

                      <div style={{ width: '24%' }}>
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel>Recursos Necessários</InputLabel>
                          <Select
                            label="Recursos Necessários"
                            multiple
                            value={goal.recursos}
                            // input={<OutlinedInput label="Tag" />}
                            renderValue={(selected: any) => selected.map(item => JSON.parse(item).recursoNome).join(', ')}
                            onChange={e => onChangeInputsMetas(index, 'recursos', e.target.value)}
                          >
                            {resources?.map(resouce => (
                              <MenuItem key={resouce.id} value={JSON.stringify(resouce)}>
                                <Checkbox checked={goal.recursos.indexOf(JSON.stringify(resouce)) > -1} />
                                <ListItemText primary={resouce.recursoNome} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Box>
                    <Box display="flex" flexDirection="column" width="100%" gap=".8rem">
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        label="Avaliação de Resultados (Onde / Como verifico os resultados)"
                        value={goal.avaliacaoResultado || ''}
                        onChange={e => onChangeInputsMetas(index, 'avaliacaoResultado', e.target.value)}
                      />
                      <div style={{ width: '24%' }}>
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel>Frequência (Avaliação dos Resultados)</InputLabel>
                          <Select
                            label="Frequência (Avaliação dos Resultados)"
                            value={goal.periodo}
                            onChange={e => onChangeInputsMetas(index, 'periodo', e.target.value)}
                          >
                            {evaluation?.map((value, index) => (
                              <MenuItem key={index} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Box>
                  </Box>
                </div>
              </div>
            ))
            .reverse()}
        </div>
      </div>

      {/* Botões de salvar ou cancelar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px', margin: '0 3rem 3rem auto' }} className="mt-5">
        <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => cancelNewGoal()}>
          Voltar
        </Button>
        <Button
          // disabled={targetGoalsId <= 0}
          onClick={() => saveGoalsObj()}
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
