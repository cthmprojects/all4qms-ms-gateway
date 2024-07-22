import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

const riskOptions = {
  'Aceitar o Risco': 'Aceitar o Risco',
  'Reduzir o Risco': 'Reduzir o Risco',
  'Avaliar o Risco': 'Avaliar o Risco',
};

const getBackgroundColor = (severity, frequency) => {
  if ((severity === 1 && frequency === 1) || (severity === 1 && frequency === 2)) return 'green';
  if ((severity === 2 && frequency === 1) || (severity === 1 && frequency === 3) || (severity === 2 && frequency === 2)) return 'yellow';
  if ((severity === 2 && frequency === 3) || (severity === 3 && frequency === 2) || (severity === 3 && frequency === 3)) return 'red';
  return 'white';
};

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'grey',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(1),
}));

interface RiskCellProps {
  bgColor: string;
}

const RiskCell = styled(TableCell)<RiskCellProps>(({ theme, bgColor }) => ({
  backgroundColor: bgColor,
  textAlign: 'center',
  padding: theme.spacing(1),
  border: '1px solid black',
}));

const VerticalTextCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'grey',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(1),
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)', // Rotação para ajustar a direção do texto
}));

const ConfigComplexityMatrix: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell rowSpan={2} colSpan={2}></HeaderCell>
            <HeaderCell colSpan={3}>Severidade/ Gravidade</HeaderCell>
          </TableRow>
          <TableRow>
            <HeaderCell>1 - Baixa</HeaderCell>
            <HeaderCell>2 - Média</HeaderCell>
            <HeaderCell>3 - Alta</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <VerticalTextCell rowSpan={5}>Probabilidade/ Frequência</VerticalTextCell>
          </TableRow>
          {[1, 2, 3].map(frequency => (
            <TableRow key={frequency}>
              <HeaderCell>{frequency === 1 ? '1 - Baixa' : frequency === 2 ? '2 - Média' : '3 - Alta'}</HeaderCell>
              {[1, 2, 3].map(severity => (
                <RiskCell key={severity} bgColor={getBackgroundColor(severity, frequency)}>
                  <Select
                    fullWidth
                    defaultValue={riskOptions[Object.keys(riskOptions)[0]]}
                    variant="outlined"
                    sx={{ backgroundColor: 'white' }}
                  >
                    {Object.values(riskOptions).map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </RiskCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConfigComplexityMatrix;
