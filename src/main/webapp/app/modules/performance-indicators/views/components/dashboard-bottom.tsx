import { Title } from '@mui/icons-material';
import './dashboard-body.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';
import { GoalMeasured, Pair } from '../../models';
import { DataChart } from '../../models/charts';

type DashboardBottomProps = {
  comparisonByPeriod: Array<GoalMeasured>;
  metasPeriodo: Array<DataChart>;
};

const DashboardBottom = ({ comparisonByPeriod, metasPeriodo }: DashboardBottomProps) => {
  return (
    <div className="parent">
      <div className="child" style={{ width: '50%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={comparisonByPeriod}
            title="Comparação por Períodos"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="metas" fill="#344BFD" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="medições" fill="#FF9359" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="child" style={{ width: '50%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={metasPeriodo}
            title="Metas por Período"
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="meta" stackId="a" fill="#344BFD" />
            <Bar dataKey="realizado" stackId="a" fill="#E9ECF1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default DashboardBottom;
