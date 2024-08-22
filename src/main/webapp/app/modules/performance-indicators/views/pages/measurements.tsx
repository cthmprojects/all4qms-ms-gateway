import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Enums, Indicator, IndicatorGoal, SummarizedProcess } from '../../models';
import { getFrequencies, getTrends, getUnits } from '../../reducers/enums.reducer';
import { getIndicatorGoal, updateIndicatorGoal } from '../../reducers/indicator-goals.reducer';
import { getIndicator } from '../../reducers/indicators.reducer';
import { IndicatorDetails, IndicatorMeasurements } from '../components';

const Measurements = () => {
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
        goals: indicatorGoal.goals,
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

  const onIndicatorMeasurementsChanged = (measurements: Array<Array<number | null>>): void => {
    setMeasurements(measurements);
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Indicadores</Typography>
          <Typography className="link">Medições</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Indicadores</h2>

            <Stack spacing={2}>
              <IndicatorDetails initialValue={indicator} processes={summarizedProcesses} readonly trends={trends} units={units} />

              <IndicatorMeasurements
                frequencies={frequencies}
                initialValues={initialMeasurementValues}
                onChanged={onIndicatorMeasurementsChanged}
                unit="PERCENTUAL"
              />
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
