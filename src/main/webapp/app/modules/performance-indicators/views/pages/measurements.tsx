import { Autocomplete, Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo, useState } from 'react';
import { Storage } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Analysis, Enums, Indicator, IndicatorGoal, SummarizedProcess } from '../../models';
import { deleteIndicatorAnalysis, getIndicatorAnalysis, saveIndicatorAnalysis } from '../../reducers/analysis.reducer';
import { getFrequencies, getTrends, getUnits } from '../../reducers/enums.reducer';
import { getIndicatorGoal, updateIndicatorGoal } from '../../reducers/indicator-goals.reducer';
import { getIndicator } from '../../reducers/indicators.reducer';
import { getYearRange } from '../../utils';
import { IndicatorDetails, IndicatorMeasurements } from '../components';

const Measurements = () => {
  const [allAnalysis, setAllAnalysis] = useState<Array<Array<Analysis>>>([]);
  const [goals, setGoals] = useState<Array<Array<number | null>>>([]);
  const [measurements, setMeasurements] = useState<Array<Array<number | null>>>([]);
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(getProcesses());
    dispatch(getFrequencies());
    dispatch(getTrends());
    dispatch(getUnits());
  }, []);

  useEffect(() => {
    const indicatorGoalId: number = parseInt(id);

    dispatch(getIndicatorGoal(indicatorGoalId));
    dispatch(getIndicatorAnalysis(indicatorGoalId));
  }, [id]);

  const back = (): void => {
    navigate('../analytics');
  };

  const matchesRole = (userRole: string, role: string) => {
    if (!userRole || !role) {
      return false;
    }

    return userRole.includes(role);
  };

  const userRole = useMemo<string>(() => {
    return Storage.local.get('ROLE');
  }, []);

  const save = async (): Promise<void> => {
    // TODO: Save multiple measurements

    dispatch(
      updateIndicatorGoal({
        frequency: indicatorGoal.frequency,
        goals: goals[0],
        id: indicatorGoal.id,
        indicator: indicatorGoal.indicator,
        measurements: measurements[0],
        year: indicatorGoal.year,
      })
    );

    for (let i = 0; i < allIndicatorGoalAnalysis.length; i++) {
      const analysis: Analysis | null = allIndicatorGoalAnalysis[i];
      if (!analysis) {
        continue;
      }
      await dispatch(deleteIndicatorAnalysis(analysis));
    }
    for (let i = 0; i < allAnalysis.length; i++) {
      const currentAnalysis: Array<Analysis> = allAnalysis[i];
      if (currentAnalysis.length <= 0) {
        continue;
      }

      for (let j = 0; j < currentAnalysis.length; j++) {
        const current: Analysis = currentAnalysis[j];

        if (!current.action && !current.analysisDetails && !current.deadline && !current.description && current.responsible <= 0) {
          continue;
        }

        await dispatch(
          saveIndicatorAnalysis({
            ...current,
            id: null,
            indicatorGoal: indicatorGoal,
            indicatorGoalId: indicatorGoal.id,
          })
        );
      }
    }

    navigate('../analytics');
  };

  const enums: Enums = useAppSelector<Enums>(state => state.all4qmsmsgatewaymetaind.enums.entity);
  const indicator: Indicator | null = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicators.entity);
  const indicatorGoal: IndicatorGoal | null = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicatorGoals.entity);
  const processes: Array<Process> = useAppSelector(state => state.all4qmsmsgatewayrnc.process.entities);
  const allIndicatorGoalAnalysis: Array<Analysis> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicatorAnalysis.entities);
  const users = useAppSelector(state => state.all4qmsmsgatewaymetaind.users.entities);

  useEffect(() => {
    if (!indicatorGoal || !indicatorGoal.id) {
      return;
    }

    dispatch(getIndicator(indicatorGoal.indicator.id));
  }, [indicatorGoal]);

  useEffect(() => {
    if (!indicatorGoal) {
      return;
    }

    setGoals([[...indicatorGoal.goals]]);
  }, [indicatorGoal]);

  const frequencies = useMemo<Array<string>>(() => {
    if (!enums || !enums.frequencies || enums.frequencies.length <= 0) {
      return [];
    }

    return enums.frequencies.map(t => t.name);
  }, [enums]);

  const initialMeasurementValues = useMemo<Array<Array<number | null>> | null>(() => {
    if (!indicatorGoal) {
      return [];
    }

    return [[...indicatorGoal.measurements]];
  }, [indicatorGoal]);

  const trends = useMemo<Array<string>>(() => {
    if (!enums || !enums.trends || enums.trends.length <= 0) {
      return [];
    }

    return enums.trends.map(t => t.name);
  }, [enums]);

  const units = useMemo<Array<string>>(() => {
    if (!enums || !enums.units || enums.units.length <= 0) {
      return [];
    }

    return enums.units.map(t => t.name);
  }, [enums]);

  const summarizedProcesses = useMemo<Array<SummarizedProcess>>(() => {
    if (!processes || processes.length <= 0) {
      return [];
    }

    return processes.map(p => {
      return {
        id: p.id,
        name: p.nome,
      };
    });
  }, [processes]);

  const onIndicatorGoalsChanged = (goals: Array<Array<number | null>>): void => {
    setGoals(goals);
  };

  const onIndicatorMeasurementsChanged = (measurements: Array<Array<number | null>>, allAnalysis: Array<Array<Analysis>>): void => {
    setAllAnalysis(allAnalysis);
    setMeasurements(measurements);
  };

  const analysisIndices = useMemo<Array<number>>(() => {
    if (!indicatorGoal) {
      return [];
    }

    const frequency: string = indicatorGoal.frequency;

    const indices: Array<number> = [];

    if (frequency === 'MENSAL') {
      indices.push(0);
      indices.push(1);
      indices.push(2);
      indices.push(3);
      indices.push(4);
      indices.push(5);
      indices.push(6);
      indices.push(7);
      indices.push(8);
      indices.push(9);
      indices.push(10);
      indices.push(11);
    } else if (frequency === 'BIMESTRAL') {
      indices.push(0);
      indices.push(2);
      indices.push(4);
      indices.push(6);
      indices.push(8);
      indices.push(10);
    } else if (frequency === 'TRIMESTRAL') {
      indices.push(0);
      indices.push(3);
      indices.push(6);
      indices.push(9);
    } else if (frequency === 'QUADRIMESTRAL') {
      indices.push(0);
      indices.push(4);
      indices.push(8);
    } else if (frequency === 'SEMESTRAL') {
      indices.push(0);
      indices.push(6);
    } else if (frequency === 'ANUAL') {
      indices.push(0);
    }

    return indices;
  }, [indicatorGoal]);

  const analysisLabels = useMemo<Array<string>>(() => {
    if (!indicatorGoal) {
      return [];
    }

    const frequency: string = indicatorGoal.frequency;

    const labels: Array<string> = [];

    if (frequency === 'MENSAL') {
      labels.push('JAN');
      labels.push('FEV');
      labels.push('MAR');
      labels.push('ABR');
      labels.push('MAI');
      labels.push('JUN');
      labels.push('JUL');
      labels.push('AGO');
      labels.push('SET');
      labels.push('OUT');
      labels.push('NOV');
      labels.push('DEZ');
    } else if (frequency === 'BIMESTRAL') {
      labels.push('1º B');
      labels.push('2º B');
      labels.push('3º B');
      labels.push('4º B');
      labels.push('5º B');
      labels.push('6º B');
    } else if (frequency === 'TRIMESTRAL') {
      labels.push('1º T');
      labels.push('2º T');
      labels.push('3º T');
      labels.push('4º T');
    } else if (frequency === 'QUADRIMESTRAL') {
      labels.push('1º Q');
      labels.push('2º Q');
      labels.push('3º Q');
    } else if (frequency === 'SEMESTRAL') {
      labels.push('1º S');
      labels.push('2º S');
    } else if (frequency === 'ANUAL') {
      labels.push('Ano');
    }

    return labels;
  }, [indicatorGoal]);

  useEffect(() => {
    if (!analysisIndices || !analysisLabels || analysisIndices.length !== analysisLabels.length) {
      return;
    }

    const arr: Array<Array<Analysis>> = [];

    for (let i = 0; i < analysisIndices.length; i++) {
      const current: Array<Analysis> =
        allIndicatorGoalAnalysis.length > 0
          ? allIndicatorGoalAnalysis.filter(o => o.month === i)
          : [
              {
                action: '',
                analysisDetails: '',
                deadline: '',
                description: '',
                indicatorGoal: null,
                indicatorGoalId: -1,
                month: -1,
                responsible: -1,
              },
            ];

      arr.push(current);
    }

    setAllAnalysis(arr);
  }, [analysisIndices, analysisLabels, allIndicatorGoalAnalysis]);

  useEffect(() => {
    if (!initialMeasurementValues) {
      return;
    }

    setMeasurements(initialMeasurementValues);
  }, [initialMeasurementValues]);

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'../analytics'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Indicadores
          </Link>
          <Typography className="link">Medições</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Indicadores</h2>

            <Stack spacing={2}>
              <IndicatorDetails initialValue={indicator} processes={summarizedProcesses} readonly trends={trends} units={units} />

              <Stack direction="row" spacing={2}>
                <Autocomplete
                  disableClearable
                  disabled
                  options={frequencies}
                  renderInput={params => <TextField {...params} label="Frequência" />}
                  sx={{ minWidth: '215px' }}
                  value={indicatorGoal?.frequency ?? null}
                />

                <Autocomplete
                  disableClearable
                  disabled
                  getOptionLabel={option => option.toString()}
                  options={getYearRange()}
                  renderInput={props => <TextField {...props} label="Ano" />}
                  sx={{ minWidth: '100px' }}
                  value={indicatorGoal?.year ? parseInt(indicatorGoal?.year) : null}
                />
              </Stack>

              <Card>
                <CardHeader title="Metas" />
                <CardContent>
                  <IndicatorMeasurements
                    frequencies={frequencies}
                    initialAnalysis={[]}
                    initialFrequency={indicatorGoal?.frequency}
                    initialValues={goals}
                    indicatorYear={indicatorGoal?.year}
                    labels={analysisLabels}
                    onChanged={onIndicatorGoalsChanged}
                    readonly={!matchesRole(userRole, 'ROLE_ADMIN') && !matchesRole(userRole, 'ROLE_SGQ')}
                    unit="PERCENTUAL"
                    users={users}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Resultados" />
                <CardContent>
                  <IndicatorMeasurements
                    canAddAnalysis
                    frequencies={frequencies}
                    initialAnalysis={allAnalysis}
                    initialFrequency={indicatorGoal?.frequency}
                    initialValues={measurements}
                    indicatorYear={indicatorGoal?.year}
                    labels={analysisLabels}
                    onChanged={onIndicatorMeasurementsChanged}
                    unit="PERCENTUAL"
                    users={users}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </div>

      <Stack justifyContent="flex-end" gap="20px" flexDirection="row" sx={{ marginTop: '20px' }}>
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={back}>
          Voltar
        </Button>
        <Button type="submit" onClick={save} variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
          Salvar
        </Button>
      </Stack>
    </div>
  );
};

export default Measurements;
