import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoalMeasured, Indicator, IndicatorGoal, Pair, SummarizedProcess } from '../../models';
import { Charts, DataChart, MetaPeriodo, SummaryChart } from '../../models/charts';
import {
  getComparacaoPeriodo,
  getGoalsPerPeriod,
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
  const [allGoalsPerPeriod, setAllGoalsPerPeriod] = useState<Array<Array<SummaryChart>>>([]);
  const [allGoalsLabels, setAllGoalsLabels] = useState<Array<string>>([]);

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

      let measurements = 0;
      let goals = 0;

      const currentIndicators: Array<Indicator> = indicators.filter(o => o.processId === p.id);
      const currentIndicatorIds: Set<number> = new Set<number>(currentIndicators.map(o => o.id));

      const currentGoals: Array<IndicatorGoal> = indicatorGoals.filter(o => currentIndicatorIds.has(o.indicator.id));

      for (let i = 0; i < currentGoals.length; i++) {
        const currentGoal: IndicatorGoal = currentGoals[i];

        measurements += currentGoal.measurements.filter(m => m).reduce((acc, curr) => acc + curr, 0);
        goals += currentGoal.goals.filter(m => m).reduce((acc, curr) => acc + curr, 0);
      }

      return {
        name,
        goal: goals,
        metas: goals,
        measured: measurements,
        medições: measurements,
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
    const now: Date = new Date();

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

      const all: Array<number> = indicatorGoal.measurements;
      const month: number = now.getMonth();
      let isComplete: boolean = true;
      let step: number = 1;

      if (indicatorGoal.frequency === 'MENSAL') {
        step = 1;
      } else if (indicatorGoal.frequency === 'BIMESTRAL') {
        step = 2;
      } else if (indicatorGoal.frequency === 'TRIMESTRAL') {
        step = 3;
      } else if (indicatorGoal.frequency === 'QUADRIMESTRAL') {
        step = 4;
      } else if (indicatorGoal.frequency === 'SEMESTRAL') {
        step = 6;
      } else {
        step = 12;
      }

      for (let i = 0; i <= month; i = i + step) {
        const currentMeasurement: number | null = all[i];

        if (!currentMeasurement) {
          isComplete = false;
          break;
        }
      }

      if (isComplete) {
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

  const qualityProductionValue = charts.qualidadeProducao;
  const productionVariation = charts.variacao;

  const getReferences = (frequency: string): Array<string> => {
    if (frequency === 'Mensal') {
      return ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    } else if (frequency === 'Bimestral') {
      return ['1º B', '2º B', '3º B', '4º B', '5º B', '6º B'];
    } else if (frequency === 'Trimestral') {
      return ['1º T', '2º T', '3º T', '4º T'];
    } else if (frequency === 'Quadrimestral') {
      return ['1º Q', '2º Q', '3º Q'];
    } else if (frequency === 'Semestral') {
      return ['1º S', '2º S'];
    } else {
      const now: Date = new Date();
      const year: number = now.getFullYear();

      return [year.toString()];
    }
  };

  const parseRawGoalsPerPeriod = (rawData: Array<DataChart>): Array<SummaryChart> => {
    const metasPeriodo: Array<DataChart> = rawData;
    const data: Array<SummaryChart> = [];

    if (!metasPeriodo || metasPeriodo.length <= 0) {
      return [];
    }

    const references: Array<string> = getReferences(metasPeriodo[0].unidadeTemporal);

    for (let i = 0; i < metasPeriodo.length; i++) {
      const metaPeriodo: DataChart = metasPeriodo[i];
      data.push({
        meta: metaPeriodo.meta,
        realizado: metaPeriodo.realizado,
        referencia: references[i],
      });
    }

    return data;
  };

  const goalsPerPeriod = useMemo<Array<SummaryChart>>(() => {
    if (!charts || !charts.metaPeriodo || charts.metaPeriodo.length <= 0) {
      return [];
    }

    return parseRawGoalsPerPeriod(charts.metaPeriodo);
  }, [charts]);

  const getAllGoals = async (indicators: Array<Indicator>): Promise<void> => {
    const now: Date = new Date();
    const year: number = now.getFullYear();

    const allGoals: Array<Array<SummaryChart>> = [];
    const labels: Array<string> = [];

    for (let i = 0; i < indicators.length; i++) {
      const indicator: Indicator = indicators[i];

      const rawGoalsPerPeriod: MetaPeriodo | null = await getGoalsPerPeriod({
        idIndicador: indicator.id,
        idProcesso: indicator.processId,
        anoIndicador: year.toString(),
      });

      if (!rawGoalsPerPeriod) {
        continue;
      }

      const parsed: Array<SummaryChart> = parseRawGoalsPerPeriod(rawGoalsPerPeriod.dados);

      if (parsed.length > 0) {
        allGoals.push(parsed);
        labels.push(indicator.name);
      }
    }

    setAllGoalsPerPeriod(allGoals);
    setAllGoalsLabels(labels);
  };

  useEffect(() => {
    if (!indicators || indicators.length <= 0) {
      setAllGoalsPerPeriod([]);
      setAllGoalsLabels([]);
      return;
    }

    getAllGoals(indicators);
  }, [indicators]);

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
            <DashboardBottom
              comparisonByPeriod={indicatorComparisonByPeriod}
              metasPeriodo={goalsPerPeriod}
              allGoalsPerPeriod={allGoalsPerPeriod}
              allGoalsLabels={allGoalsLabels}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
