import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Enums, SummarizedProcess } from '../../models';
import { getFrequencies, getTrends, getUnits } from '../../reducers/enums.reducer';
import { saveIndicatorGoal } from '../../reducers/indicator-goals.reducer';
import { IndicatorDetails, IndicatorGoals } from '../components';

const AddIndicator = () => {
  const [code, setCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [goalFrequencies, setGoalFrequencies] = useState<Array<string>>([]);
  const [goals, setGoals] = useState<Array<Array<number | null>>>([]);
  const [goalYears, setGoalYears] = useState<Array<number>>([]);
  const [name, setName] = useState<string>('');
  const [process, setProcess] = useState<SummarizedProcess | null>(null);
  const [trend, setTrend] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getFrequencies());
    dispatch(getTrends());
    dispatch(getUnits());
  }, []);

  const onDetailsChanged = (
    code: string,
    description: string,
    name: string,
    process: SummarizedProcess,
    trend: string,
    unit: string
  ): void => {
    setCode(code);
    setDescription(description);
    setName(name);
    setProcess(process);
    setTrend(trend);
    setUnit(unit);
  };

  const onIndicatorGoalsChanged = (frequencies: Array<string>, goals: Array<Array<number | null>>, years: Array<number>): void => {
    setGoalFrequencies(frequencies);
    setGoals(goals);
    setGoalYears(years);
  };

  const back = (): void => {
    navigate('../');
  };

  const save = (): void => {
    // TODO: Save multiple goals

    dispatch(
      saveIndicatorGoal({
        frequency: goalFrequencies[0] as 'MENSAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'QUADRIMESTRAL' | 'SEMESTRAL' | 'ANUAL',
        goals: goals[0],
        indicator: {
          code: code,
          description: description,
          name: name,
          processId: process?.id,
          trend: trend as 'MAIOR' | 'MENOR' | 'ESTABILIZAR',
          unit: unit as 'PERCENTUAL' | 'MONETARIO' | 'UNITARIO' | 'DECIMAL',
        },
        measurements: [null, null, null, null, null, null, null, null, null, null, null, null],
        year: goalYears[0].toString(),
      })
    );

    navigate('../');
  };

  const enums: Enums = useAppSelector<Enums>(state => state.all4qmsmsgatewaymetaind.enums.entity);

  const processes: Array<Process> = useAppSelector(state => state.all4qmsmsgatewayrnc.process.entities);

  const frequencies = useMemo<Array<string>>(() => {
    if (!enums || !enums.frequencies || enums.frequencies.length <= 0) {
      return [];
    }

    return enums.frequencies.map(t => t.name);
  }, [enums]);

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

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Indicadores</Typography>
          <Typography className="link">Cadastro</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Indicadores</h2>

            <Stack spacing={2}>
              <IndicatorDetails onChanged={onDetailsChanged} processes={summarizedProcesses} trends={trends} units={units} />

              <IndicatorGoals frequencies={frequencies} onChanged={onIndicatorGoalsChanged} unit={unit} />
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

export default AddIndicator;
