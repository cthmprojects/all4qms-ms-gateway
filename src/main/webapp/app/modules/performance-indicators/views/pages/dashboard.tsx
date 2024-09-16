import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoalMeasured, Indicator, IndicatorGoal, Pair, SummarizedProcess } from '../../models';
import { getAllIndicatorGoals } from '../../reducers/indicator-goals.reducer';
import { getAllIndicators } from '../../reducers/indicators.reducer';
import { DashboardHeader } from '../components';
import DashboardBody from '../components/dashboard-body';
import DashboardBottom from '../components/dashboard-bottom';
import { Charts } from '../../models/charts';
import {
  getMetasPeriodo,
  getComparacaoPeriodo,
  getMetasProcesso,
  getPreenchimentoIndicadores,
  getQualidadeProducao,
} from '../../reducers/charts.reducer';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getAllIndicators());
    dispatch(getAllIndicatorGoals());
    dispatch(getMetasPeriodo({ idIndicador: 1, idProcesso: 1, anoIndicador: '2024' }));
    dispatch(getQualidadeProducao({ idIndicador: 1, idProcesso: 1, anoIndicador: '2024' }));
    dispatch(getComparacaoPeriodo({ idIndicador: 1, idProcesso: 1, anoIndicador: '2024' }));
    dispatch(getMetasProcesso({ idIndicador: 1, idProcesso: 1, anoIndicador: '2024' }));
    dispatch(getPreenchimentoIndicadores({ idIndicador: 1, idProcesso: 1, anoIndicador: '2024' }));
  }, []);

  const goToAnalytics = (): void => {
    navigate('analytics');
  };

  const indicators: Array<Indicator> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicators.entities);
  const indicatorGoals: Array<IndicatorGoal> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicatorGoals.entities);
  const processes: Array<Process> = useAppSelector(state => state.all4qmsmsgatewayrnc.process.entities);
  const charts: Charts = useAppSelector(state => state.all4qmsmsgatewaymetaind.charts.entity);

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

  const indicatorGoalsByProcess = useMemo<Array<Pair>>(() => {
    if (
      !indicators ||
      !indicatorGoals ||
      !summarizedProcesses ||
      indicators.length <= 0 ||
      indicatorGoals.length <= 0 ||
      summarizedProcesses.length <= 0
    ) {
      return [];
    }

    return summarizedProcesses.map(p => {
      const id: number = p.id;
      const name: string = p.name;

      const currentProcessIndicators: Array<Indicator> = indicators.filter(i => i && i.id && i.processId && i.processId === id);
      const indicatorIds: Set<number> = new Set<number>(currentProcessIndicators.map(i => i.id));

      const value: number = indicatorGoals.filter(g => g.indicator && g.indicator.id && indicatorIds.has(g.indicator.id)).length;
      return {
        name,
        value,
      };
    });
  }, [indicators, indicatorGoals, summarizedProcesses]);

  const indicatorComparisonByPeriod = useMemo<Array<GoalMeasured>>(() => {
    if (
      !indicators ||
      !indicatorGoals ||
      !summarizedProcesses ||
      indicators.length <= 0 ||
      indicatorGoals.length <= 0 ||
      summarizedProcesses.length <= 0
    ) {
      return [];
    }

    return summarizedProcesses.map(p => {
      const name: string = p.name;

      let sumMeasurements = 0;
      let sumGoals = 0;
      indicatorGoals.forEach(element => {
        element.measurements.forEach(num => {
          if (num) sumMeasurements += num;
        });

        element.goals.forEach(num => {
          if (num) sumGoals += num;
        });
      });

      return {
        name,
        goal: sumGoals,
        measured: sumMeasurements,
      };
    });
  }, [indicators, indicatorGoals, summarizedProcesses]);

  const indicatorGoalsFeeding = useMemo<Array<Pair>>(() => {
    if (
      !indicators ||
      !indicatorGoals ||
      !summarizedProcesses ||
      indicators.length <= 0 ||
      indicatorGoals.length <= 0 ||
      summarizedProcesses.length <= 0
    ) {
      return [];
    }

    return summarizedProcesses.map(p => {
      const id: number = p.id;
      const name: string = p.name;

      const currentProcessIndicators: Array<Indicator> = indicators.filter(i => i && i.id && i.processId && i.processId === id);
      const indicatorIds: Set<number> = new Set<number>(currentProcessIndicators.map(i => i.id));
      const totalIndicatorGoal: number = indicatorGoals.filter(
        g => g.indicator && g.indicator.id && indicatorIds.has(g.indicator.id)
      ).length;

      let totalIndicatorGoalFeeded = 0;
      indicatorGoals.forEach(element => {
        if (element.indicator && element.indicator.id && indicatorIds.has(element.indicator.id)) {
          let frequencyExpected = 0;
          switch (element.frequency) {
            case 'MENSAL':
              frequencyExpected = 12;
              break;
            case 'BIMESTRAL':
              frequencyExpected = 6;
              break;
            case 'TRIMESTRAL':
              frequencyExpected = 4;
              break;
            case 'QUADRIMESTRAL':
              frequencyExpected = 3;
              break;
            case 'SEMESTRAL':
              frequencyExpected = 2;
              break;
            default:
              frequencyExpected = 1;
              break;
          }
          const feeded = element.measurements.filter(m => m && m != null).length;
          if (feeded === frequencyExpected) totalIndicatorGoalFeeded += 1;
        }
      });

      const value: number = (totalIndicatorGoalFeeded / totalIndicatorGoal) * 100;

      return {
        name: name,
        value: value,
      };
    });
  }, [indicators, indicatorGoals, summarizedProcesses]);

  const metasPeriodo = charts.metaPeriodo;

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Indicadores</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Indicador</h2>

            <DashboardHeader
              indicators={indicators}
              onAnalyticsRequested={goToAnalytics}
              onSearchRequested={() => {}}
              processes={summarizedProcesses}
            />
          </Box>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <DashboardBody goalsByProcess={indicatorGoalsByProcess} indicatorGoalsFeeding={indicatorGoalsFeeding} />
          </Box>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <DashboardBottom comparisonByPeriod={indicatorComparisonByPeriod} metasPeriodo={metasPeriodo} />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
