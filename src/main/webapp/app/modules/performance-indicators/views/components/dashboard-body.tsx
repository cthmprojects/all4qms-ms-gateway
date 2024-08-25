import './dashboard-body.css';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  Line,
  Sector,
} from 'recharts';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

const dataPreenchimentoIndicadores = [
  { name: 'Pendente', value: 75 },
  { name: 'Preenchido', value: 25 },
];

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Ind2 ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Percentual ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const dataComposedBarLine = [
  {
    name: 'Page A',
    Ind1: 590,
    Ind2: 800,
    Ind3: 1400,
  },
  {
    name: 'Page B',
    Ind1: 868,
    Ind2: 967,
    Ind3: 1506,
  },
  {
    name: 'Page C',
    Ind1: 1397,
    Ind2: 1098,
    Ind3: 989,
  },
  {
    name: 'Page D',
    Ind1: 1480,
    Ind2: 1200,
    Ind3: 1228,
  },
  {
    name: 'Page E',
    Ind1: 1520,
    Ind2: 1108,
    Ind3: 1100,
  },
  {
    name: 'Page F',
    Ind1: 1400,
    Ind2: 680,
    Ind3: 1700,
  },
];

const data02 = [
  { name: 'A1', value: 100 },
  { name: 'A2', value: 300 },
  { name: 'B1', value: 100 },
  { name: 'B2', value: 80 },
  { name: 'B3', value: 40 },
  { name: 'B4', value: 30 },
  { name: 'B5', value: 50 },
  { name: 'C1', value: 100 },
  { name: 'C2', value: 200 },
  { name: 'D1', value: 150 },
  { name: 'D2', value: 50 },
];

const DashboardBody = () => {
  return (
    <Stack direction="row" spacing={2}>
      <div className="featuredItem">
        <span className="featuredTitle"> Qualidade Geral de Produção</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney"> 99,22% </span>
          <span className="featuredMoneyRate">
            5,33 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart width={400} height={400} title="Metas por Processo">
            <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#FFD200" label />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart width={400} height={400} title="Preenchimento dos Indicadores">
            <Pie
              data={dataPreenchimentoIndicadores}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#3A5AFE"
              label
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            width={500}
            height={400}
            data={dataComposedBarLine}
            title="Defeito A - 2024"
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Ind3" fill="#344BFD" stroke="#1F2D97" />
            <Bar dataKey="Ind2" barSize={20} fill="#2841FD" />
            <Line type="monotone" dataKey="Ind1" stroke="#344BFD" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Stack>
  );
};
export default DashboardBody;
