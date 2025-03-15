import { Stack } from '@mui/material';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Pair } from '../../models';
import './dashboard-body.css';

type DashboardBodyProps = {
  goalsByProcess: Array<Pair>;
  indicatorGoalsFeeding: Array<Pair>;
  qualityProductionValue: number;
  productionVariation: number;
};

const DashboardBody = ({ goalsByProcess, indicatorGoalsFeeding, qualityProductionValue, productionVariation }: DashboardBodyProps) => {
  const brownPalette: Array<string> = ['#A23900', '#B96B40', '#D19C80', '#E7CDBF'];

  const yellowPalette: Array<string> = ['#EBC139', '#F0D16B', '#F5E09C'];

  const bluePalette: Array<string> = ['#0EBFCF', '#4ACFDB', '#87DFE7'];

  const greenPalette: Array<string> = ['#00AE59', '#40C283', '#80D7AC'];

  const lilacPalette: Array<string> = ['#4A148C', '#774FA9', '#A58AC6', '#D1C4E2'];

  const palette: Array<string> = brownPalette.concat(yellowPalette).concat(bluePalette).concat(greenPalette).concat(lilacPalette);

  return (
    <Stack direction="row" spacing={2}>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart width={400} height={400} title="Metas por Processo">
            <Pie data={goalsByProcess} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} label>
              {goalsByProcess.map((entry, index) => (
                <Cell fill={lilacPalette[index % lilacPalette.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart width={400} height={400} title="Preenchimento dos Indicadores">
            <Pie data={indicatorGoalsFeeding} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
              {indicatorGoalsFeeding.map((entry, index) => (
                <Cell fill={brownPalette[index % brownPalette.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Stack>
  );
};
export default DashboardBody;
