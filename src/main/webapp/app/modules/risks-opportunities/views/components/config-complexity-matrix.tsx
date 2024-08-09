import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/system';
import { ClassificacaoOportunidades, ConfigurationsClassificationType } from '../../models/config-risk-opportunity';

const riskOptions = {
  'Aceitar o Risco': 'Aceitar o Risco',
  'Reduzir o Risco': 'Reduzir o Risco',
  'Avaliar o Risco': 'Avaliar o Risco',
};

const getBackgroundColor = (coluna, linha) => {
  if ((coluna === 1 && linha === 1) || (coluna === 1 && linha === 2) || (coluna === 2 && linha === 1)) return '#07C610';
  if ((coluna === 3 && linha === 1) || (coluna === 1 && linha === 3) || (coluna === 2 && linha === 2)) return '#FFDF78';
  if ((coluna === 2 && linha === 3) || (coluna === 3 && linha === 2) || (coluna === 3 && linha === 3)) return '#FF8E6A';
  return 'white';
};

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#D9D9D9',
  color: 'black',
  textAlign: 'center',
  padding: theme.spacing(1),
  border: '3px solid white',
}));

interface RiskCellProps {
  bgColor: string;
}

const RiskCell = styled(TableCell)<RiskCellProps>(({ theme, bgColor }) => ({
  backgroundColor: bgColor,
  textAlign: 'center',
  padding: theme.spacing(1),
  border: '3px solid white',
  // height: '20px'
}));

const VerticalTextCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#D9D9D9',
  color: 'black',
  fontWeight: 500,
  fontSize: '16px',
  textAlign: 'center',
  padding: theme.spacing(1),
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)', // Rotação para ajustar a direção do texto
  border: '3px solid white',
}));

interface ConfigComplexityMatrixProps {
  classifications: ClassificacaoOportunidades;
}

const ConfigComplexityMatrix: React.FC<ConfigComplexityMatrixProps> = ({ classifications }) => {
  const changeInputMatrix = (selected: SelectChangeEvent<string>) => {
    console.log(selected);
  };
  return (
    <TableContainer sx={{ width: '60rem', minWidth: '50rem', justifyContent: 'center' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell rowSpan={2} colSpan={2}></TableCell>
            <HeaderCell colSpan={3} sx={{ fontWeight: 500, fontSize: '16px' }}>
              Severidade/ Gravidade
            </HeaderCell>
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
          {[1, 2, 3].map(linha => (
            <TableRow key={linha}>
              <HeaderCell>{linha === 1 ? '1 - Baixa' : linha === 2 ? '2 - Média' : '3 - Alta'}</HeaderCell>
              {[1, 2, 3].map(coluna => (
                <RiskCell key={coluna} bgColor={getBackgroundColor(coluna, linha)}>
                  <Select
                    fullWidth
                    defaultValue={classifications.primeira.decisao}
                    variant="outlined"
                    onChange={changeInputMatrix}
                    label=" "
                    name={`${coluna}${linha}`}
                    sx={{ backgroundColor: 'white' }}
                    // inputProps={}
                  >
                    <MenuItem key={0} value={JSON.stringify(classifications.primeira)}>
                      {classifications.primeira.decisao}
                    </MenuItem>
                    <MenuItem key={1} value={JSON.stringify(classifications.segunda)}>
                      {classifications.segunda.decisao}
                    </MenuItem>
                    <MenuItem key={2} value={JSON.stringify(classifications.terceira)}>
                      {classifications.terceira.decisao}
                    </MenuItem>
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
