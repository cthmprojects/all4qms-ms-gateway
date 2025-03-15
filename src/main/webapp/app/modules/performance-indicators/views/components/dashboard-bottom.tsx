import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GoalMeasured } from '../../models';
import { DataChart } from '../../models/charts';
import './dashboard-body.css';

type DashboardBottomProps = {
  comparisonByPeriod: Array<GoalMeasured>;
  metasPeriodo: Array<DataChart>;
};

const DashboardBottom = ({ comparisonByPeriod, metasPeriodo }: DashboardBottomProps) => {
  const brownPalette: Array<string> = ['#A23900', '#B96B40', '#D19C80', '#E7CDBF'];

  const yellowPalette: Array<string> = ['#EBC139', '#F0D16B', '#F5E09C'];

  const bluePalette: Array<string> = ['#0EBFCF', '#4ACFDB', '#87DFE7'];

  const greenPalette: Array<string> = ['#00AE59', '#40C283', '#80D7AC'];

  const lilacPalette: Array<string> = ['#4A148C', '#774FA9', '#A58AC6', '#D1C4E2'];

  const palette: Array<string> = brownPalette.concat(yellowPalette).concat(bluePalette).concat(greenPalette).concat(lilacPalette);

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
            <Bar dataKey="metas" fill={lilacPalette[0]} activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="medições" fill={bluePalette[0]} activeBar={<Rectangle fill="pink" stroke="blue" />} />
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
            <Bar dataKey="meta" stackId="a" fill={yellowPalette[0]} />
            <Bar dataKey="realizado" stackId="a" fill={greenPalette[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default DashboardBottom;
