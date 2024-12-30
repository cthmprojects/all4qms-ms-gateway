import { Autocomplete, Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Analysis, Enums, Indicator, IndicatorGoal, SummarizedProcess } from '../../models';
import { getFrequencies, getTrends, getUnits } from '../../reducers/enums.reducer';
import { getIndicatorGoal, updateIndicatorGoal } from '../../reducers/indicator-goals.reducer';
import { getIndicator } from '../../reducers/indicators.reducer';
import { getYearRange } from '../../utils';
import { IndicatorDetails, IndicatorMeasurements } from '../components';

const Measurements = () => {
  const [allAnalysis, setAllAnalysis] = useState<Array<Analysis | null>>([]);
  const [goals, setGoals] = useState<Array<Array<number | null>>>([]);
  const [measurements, setMeasurements] = useState<Array<Array<number | null>>>([]);
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getFrequencies());
    dispatch(getTrends());
    dispatch(getUnits());
  }, []);

  useEffect(() => {
    dispatch(getIndicatorGoal(parseInt(id)));
  }, [id]);

  const back = (): void => {
    navigate('../');
  };

  const save = (): void => {
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

    navigate('../');
  };

  const enums: Enums = useAppSelector<Enums>(state => state.all4qmsmsgatewaymetaind.enums.entity);
  const indicator: Indicator | null = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicators.entity);
  const indicatorGoal: IndicatorGoal | null = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicatorGoals.entity);
  const processes: Array<Process> = useAppSelector(state => state.all4qmsmsgatewayrnc.process.entities);

  useEffect(() => {
    if (!indicatorGoal || !indicatorGoal.id) {
      return;
    }

    dispatch(getIndicator(indicatorGoal.indicator.id));
  }, [indicatorGoal]);

  const frequencies = useMemo<Array<string>>(() => {
    if (!enums || !enums.frequencies || enums.frequencies.length <= 0) {
      return [];
    }

    return enums.frequencies.map(t => t.name);
  }, [enums]);

  const initialGoalValues = useMemo<Array<Array<number | null>> | null>(() => {
    if (!indicatorGoal) {
      return null;
    }

    return [[...indicatorGoal.goals]];
  }, [indicatorGoal]);

  const initialMeasurementValues = useMemo<Array<Array<number | null>> | null>(() => {
    if (!indicatorGoal) {
      return null;
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

  const onIndicatorMeasurementsChanged = (measurements: Array<Array<number | null>>, allAnalysis: Array<Analysis | null>): void => {
    setAllAnalysis(allAnalysis);
    setMeasurements(measurements);
  };

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
                    initialFrequency={indicatorGoal?.frequency}
                    initialValues={initialGoalValues}
                    indicatorYear={indicatorGoal?.year}
                    onChanged={onIndicatorGoalsChanged}
                    unit="PERCENTUAL"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Resultados" />
                <CardContent>
                  <IndicatorMeasurements
                    canAddAnalysis
                    frequencies={frequencies}
                    initialFrequency={indicatorGoal?.frequency}
                    initialValues={initialMeasurementValues}
                    indicatorYear={indicatorGoal?.year}
                    onChanged={onIndicatorMeasurementsChanged}
                    unit="PERCENTUAL"
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
