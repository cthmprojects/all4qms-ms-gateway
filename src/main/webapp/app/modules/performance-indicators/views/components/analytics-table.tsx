import { EditOutlined } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { Indicator, IndicatorGoal, SummarizedProcess } from '../../models';

type AnalyticsTableProps = {
  indicatorGoals: Array<IndicatorGoal>;
  indicators: Array<Indicator>;
  processes: Array<SummarizedProcess>;
  onManageMeasurementsRequested: (id: number) => void;
};

const AnalyticsTable = ({ indicatorGoals, indicators, onManageMeasurementsRequested, processes }: AnalyticsTableProps) => {
  const getIndicator = (id: number): Indicator | null => {
    const filteredIndicators: Array<Indicator> = indicators.filter(i => i.id === id);

    return filteredIndicators.length > 0 ? filteredIndicators[0] : null;
  };

  const getProcess = (id: number): SummarizedProcess | null => {
    const filteredProcesses: Array<SummarizedProcess> = processes.filter(i => i.id === id);

    return filteredProcesses.length > 0 ? filteredProcesses[0] : null;
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">Indicador</TableCell>
            <TableCell align="left">Processo</TableCell>
            <TableCell align="left">Metas</TableCell>
            <TableCell align="left">Acumulado</TableCell>
            <TableCell align="left">JAN</TableCell>
            <TableCell align="left">FEV</TableCell>
            <TableCell align="left">MAR</TableCell>
            <TableCell align="left">ABR</TableCell>
            <TableCell align="left">MAI</TableCell>
            <TableCell align="left">JUN</TableCell>
            <TableCell align="left">JUL</TableCell>
            <TableCell align="left">AGO</TableCell>
            <TableCell align="left">SET</TableCell>
            <TableCell align="left">OUT</TableCell>
            <TableCell align="left">NOV</TableCell>
            <TableCell align="left">DEZ</TableCell>
            <TableCell align="left">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicatorGoals?.map(indicatorGoal => {
            const { frequency, goals, id, indicator, measurements, year } = indicatorGoal;

            const completeIndicator: Indicator | null = getIndicator(indicator.id);
            const process: SummarizedProcess | null = getProcess(completeIndicator?.processId);
            const filteredGoals: Array<number> = goals.filter(g => g !== null);
            // TODO: Check average calculation
            const goal: number = filteredGoals.reduce((acc, value) => acc + value) / filteredGoals.length;

            return (
              <TableRow key={id}>
                <TableCell>{completeIndicator?.name ?? '-'}</TableCell>
                <TableCell>{process?.name ?? '-'}</TableCell>
                <TableCell>{goal ?? '-'}</TableCell> {/* Metas */}
                <TableCell>{0 ?? '-'}</TableCell> {/* Acumulado */}
                <TableCell>{measurements[0] ?? '-'}</TableCell> {/* JAN */}
                <TableCell>{measurements[1] ?? '-'}</TableCell> {/* FEV */}
                <TableCell>{measurements[2] ?? '-'}</TableCell> {/* MAR */}
                <TableCell>{measurements[3] ?? '-'}</TableCell> {/* ABR */}
                <TableCell>{measurements[4] ?? '-'}</TableCell> {/* MAI */}
                <TableCell>{measurements[5] ?? '-'}</TableCell> {/* JUN */}
                <TableCell>{measurements[6] ?? '-'}</TableCell> {/* JUL */}
                <TableCell>{measurements[7] ?? '-'}</TableCell> {/* AGO */}
                <TableCell>{measurements[8] ?? '-'}</TableCell> {/* SET */}
                <TableCell>{measurements[9] ?? '-'}</TableCell> {/* OUT */}
                <TableCell>{measurements[10] ?? '-'}</TableCell> {/* NOV */}
                <TableCell>{measurements[11] ?? '-'}</TableCell> {/* DEZ */}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => onManageMeasurementsRequested(id)}>
                      <EditOutlined sx={{ color: '#e6b200' }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnalyticsTable;