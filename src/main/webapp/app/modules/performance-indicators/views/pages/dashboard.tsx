import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Indicator, IndicatorGoal, Pair, SummarizedProcess } from '../../models';
import { getAllIndicatorGoals } from '../../reducers/indicator-goals.reducer';
import { getAllIndicators } from '../../reducers/indicators.reducer';
import { DashboardHeader } from '../components';
import DashboardBody from '../components/dashboard-body';
import DashboardBottom from '../components/dashboard-bottom';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getAllIndicators());
    dispatch(getAllIndicatorGoals());
  }, []);

  const goToAnalytics = (): void => {
    navigate('analytics');
  };

  const indicators: Array<Indicator> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicators.entities);
  const indicatorGoals: Array<IndicatorGoal> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicatorGoals.entities);
  const processes: Array<Process> = useAppSelector(state => state.all4qmsmsgatewayrnc.process.entities);

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
        name: name,
        value: value,
      };
    });
  }, [indicators, indicatorGoals, summarizedProcesses]);

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
            <DashboardBody goalsByProcess={indicatorGoalsByProcess} />
          </Box>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <DashboardBottom />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
