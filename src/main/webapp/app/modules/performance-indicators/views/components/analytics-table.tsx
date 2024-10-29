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

  const getColor = (measurement: number | null, goal: number): string => {
    if (!measurement || measurement < goal) {
      return 'red';
    } else {
      return 'green';
    }
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

            const avgs: Array<number> = [];
            const avgsToShow: Array<string> = [];
            for (let i = 0; i < 12; i++) {
              if (goals[i] && measurements[i]) {
                avgs[i] = (measurements[i] / goals[i]) * 100;
                avgsToShow[i] = `${avgs[i].toFixed(2)}%`;
              } else {
                avgs[i] = 0;
                avgsToShow[i] = '-';
              }
            }
            const validGoalsQty: Array<number> = goals.filter(g => g > 0);
            const sumGoals = goals.reduce((acc, value) => acc + value);
            console.log('sumgoals ', sumGoals);
            console.log('filteredGoals.length ', validGoalsQty.length);
            const goal: number = goals.length > 0 && validGoalsQty.length > 0 ? sumGoals / validGoalsQty.length : 0;

            const filteredGoals: Array<number> = avgs.filter(g => g > 0);
            const accumulated = filteredGoals.length > 0 ? filteredGoals.reduce((acc, value) => acc + value) / validGoalsQty.length : 0;

            return (
              <TableRow key={id}>
                <TableCell>{completeIndicator?.name ?? '-'}</TableCell>
                <TableCell>{process?.name ?? '-'}</TableCell>
                <TableCell>{goal.toFixed(2) ?? '-'}</TableCell> {/* Metas */}
                <TableCell sx={{ color: getColor(accumulated, 100) }}>{accumulated.toFixed(2) ?? '-'}%</TableCell> {/* Acumulado */}
                <TableCell sx={{ color: getColor(measurements[0], goals[0]) }}>{avgsToShow[0] ?? '-'}</TableCell> {/* JAN */}
                <TableCell sx={{ color: getColor(measurements[1], goals[1]) }}>{avgsToShow[1] ?? '-'}</TableCell> {/* FEV */}
                <TableCell sx={{ color: getColor(measurements[2], goals[2]) }}>{avgsToShow[2] ?? '-'}</TableCell> {/* MAR */}
                <TableCell sx={{ color: getColor(measurements[3], goals[3]) }}>{avgsToShow[3] ?? '-'}</TableCell> {/* ABR */}
                <TableCell sx={{ color: getColor(measurements[4], goals[4]) }}>{avgsToShow[4] ?? '-'}</TableCell> {/* MAI */}
                <TableCell sx={{ color: getColor(measurements[5], goals[5]) }}>{avgsToShow[5] ?? '-'}</TableCell> {/* JUN */}
                <TableCell sx={{ color: getColor(measurements[6], goals[6]) }}>{avgsToShow[6] ?? '-'}</TableCell> {/* JUL */}
                <TableCell sx={{ color: getColor(measurements[7], goals[7]) }}>{avgsToShow[7] ?? '-'}</TableCell> {/* AGO */}
                <TableCell sx={{ color: getColor(measurements[8], goals[8]) }}>{avgsToShow[8] ?? '-'}</TableCell> {/* SET */}
                <TableCell sx={{ color: getColor(measurements[9], goals[9]) }}>{avgsToShow[9] ?? '-'}</TableCell> {/* OUT */}
                <TableCell sx={{ color: getColor(measurements[10], goals[10]) }}>{avgsToShow[10] ?? '-'}</TableCell> {/* NOV */}
                <TableCell sx={{ color: getColor(measurements[11], goals[11]) }}>{avgsToShow[11] ?? '-'}</TableCell> {/* DEZ */}
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
