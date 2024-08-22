import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Indicator, IndicatorGoal, SummarizedProcess } from '../../models';
import { getAllIndicatorGoals } from '../../reducers/indicator-goals.reducer';
import { getAllIndicators } from '../../reducers/indicators.reducer';
import { AnalyticsHeader, AnalyticsTable } from '../components';

const Analytics = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getAllIndicators());
    dispatch(getAllIndicatorGoals());
  }, []);

  const goToAddIndicator = (): void => {
    navigate('../indicator');
  };

  const goToDashboard = (): void => {
    navigate('../');
  };

  const goToManageMeasurements = (id: number): void => {
    navigate(`../indicator/${id}/measurements`);
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

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Indicadores Analíticos</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Analítico</h2>

            <AnalyticsHeader
              onAddIndicatorRequested={goToAddIndicator}
              onDashboardRequested={goToDashboard}
              onSearchRequested={() => {}}
              processes={summarizedProcesses}
            />

            <AnalyticsTable
              indicatorGoals={indicatorGoals}
              indicators={indicators}
              onManageMeasurementsRequested={goToManageMeasurements}
              processes={summarizedProcesses}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Analytics;
