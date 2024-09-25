import { Stack } from '@mui/material';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Pair } from '../../models';
import './dashboard-body.css';

type DashboardBodyProps = {
  goalsByProcess: Array<Pair>;
  indicatorGoalsFeeding: Array<Pair>;
};

const DashboardBody = ({ goalsByProcess, indicatorGoalsFeeding }: DashboardBodyProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart width={400} height={400} title="Metas por Processo">
            <Pie data={goalsByProcess} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} label>
              {goalsByProcess.map((entry, index) => (
                <Cell fill={['#FFD200', '#3A5AFE', '#EEA092', '#EC8B18'][index % 4]} />
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
                <Cell fill={['#3A5AFE', '#E6E6E6'][index % 2]} />
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
