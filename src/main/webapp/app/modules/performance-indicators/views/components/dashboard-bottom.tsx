import { Title } from '@mui/icons-material';
import './dashboard-body.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';
import { GoalMeasured, Pair } from '../../models';

const data = [
  {
    name: 'Indicador A',
    Ind1: 4000,
    Ind2: 2400,
    Ind3: 2400,
  },
  {
    name: 'Indicador B',
    Ind1: 3000,
    Ind2: 1398,
    Ind3: 2210,
  },
  {
    name: 'Indicador C',
    Ind1: 2000,
    Ind2: 9800,
    Ind3: 2290,
  },
  {
    name: 'Indicador D',
    Ind1: 2780,
    Ind2: 3908,
    Ind3: 2000,
  },
  {
    name: 'Indicador E',
    Ind1: 1890,
    Ind2: 4800,
    Ind3: 2181,
  },
  {
    name: 'Indicador F',
    Ind1: 2390,
    Ind2: 3800,
    Ind3: 2500,
  },
  {
    name: 'Indicador G',
    Ind1: 3490,
    Ind2: 4300,
    Ind3: 2100,
  },
];

type DashboardBottomProps = {
  comparisonByPeriod: Array<GoalMeasured>;
};

const DashboardBottom = ({ comparisonByPeriod }: DashboardBottomProps) => {
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
            <Bar dataKey="goal" fill="#344BFD" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="measured" fill="#FF9359" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="child" style={{ width: '50%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={data}
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
            <Bar dataKey="Ind1  " stackId="a" fill="#344BFD" />
            <Bar dataKey="Ind2" stackId="a" fill="#E9ECF1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default DashboardBottom;
