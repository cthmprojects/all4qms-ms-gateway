import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoalMeasured, Indicator, IndicatorGoal, Pair, SummarizedProcess } from '../../models';
import { Charts } from '../../models/charts';
import {
  getComparacaoPeriodo,
  getMetasPeriodo,
  getMetasProcesso,
  getPreenchimentoIndicadores,
  getQualidadeProducao,
} from '../../reducers/charts.reducer';
import { getAllIndicatorGoals } from '../../reducers/indicator-goals.reducer';
import { getAllIndicators } from '../../reducers/indicators.reducer';
import { DashboardHeader } from '../components';
import DashboardBody from '../components/dashboard-body';
import DashboardBottom from '../components/dashboard-bottom';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const now: Date = new Date();
    const year: number = now.getFullYear();

    dispatch(getProcesses());
    dispatch(getAllIndicators());
    dispatch(getAllIndicatorGoals());
    dispatch(getMetasPeriodo({ idIndicador: 1, idProcesso: 1, anoIndicador: year.toString() }));
    dispatch(getQualidadeProducao({ idIndicador: 1, idProcesso: 1, anoIndicador: year.toString() }));
    dispatch(getComparacaoPeriodo({ idIndicador: 1, idProcesso: 1, anoIndicador: year.toString() }));
    dispatch(getMetasProcesso({ idIndicador: 1, idProcesso: 1, anoIndicador: year.toString() }));
    dispatch(getPreenchimentoIndicadores({ idIndicador: 1, idProcesso: 1, anoIndicador: year.toString() }));
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
        metas: sumGoals,
        measured: sumMeasurements,
        medições: sumMeasurements,
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

    const indicatorsCount: number = indicators.length;

    let completedIndicators: number = 0;

    for (let i = 0; i < indicators.length; i++) {
      const indicator: Indicator = indicators[i];

      if (!indicator.id) {
        continue;
      }

      const indicatorGoal: IndicatorGoal | null = indicatorGoals.find(ig => ig.indicator && ig.indicator.id === indicator.id);

      if (!indicatorGoal) {
        continue;
      }

      let expectedMeasurements: number = 0;
      if (indicatorGoal.frequency === 'MENSAL') {
        expectedMeasurements = 12;
      } else if (indicatorGoal.frequency === 'BIMESTRAL') {
        expectedMeasurements = 6;
      } else if (indicatorGoal.frequency === 'TRIMESTRAL') {
        expectedMeasurements = 4;
      } else if (indicatorGoal.frequency === 'QUADRIMESTRAL') {
        expectedMeasurements = 3;
      } else if (indicatorGoal.frequency === 'SEMESTRAL') {
        expectedMeasurements = 2;
      } else {
        expectedMeasurements = 1;
      }

      const measurements: number = indicatorGoal.measurements.filter(m => m).length;

      if (measurements === expectedMeasurements) {
        completedIndicators++;
      }
    }

    return [
      {
        name: 'Preenchidos',
        value: completedIndicators,
      },
      {
        name: 'Pendentes',
        value: indicatorsCount - completedIndicators,
      },
    ];
  }, [indicators, indicatorGoals, summarizedProcesses]);

  const metasPeriodo = charts.metaPeriodo;
  // console.log("Charts Values: " +charts);
  const qualityProductionValue = charts.qualidadeProducao;
  const productionVariation = charts.variacao;

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
            <DashboardBody
              goalsByProcess={indicatorGoalsByProcess}
              indicatorGoalsFeeding={indicatorGoalsFeeding}
              qualityProductionValue={qualityProductionValue}
              productionVariation={productionVariation}
            />
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
