import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { ConfigurationsClassificationType } from './config-degrees';

const riskOptions = {
  'Aceitar o Risco': 'Aceitar o Risco',
  'Reduzir o Risco': 'Reduzir o Risco',
  'Avaliar o Risco': 'Avaliar o Risco',
};

const getBackgroundColor = (severity, frequency) => {
  if ((severity === 1 && frequency === 1) || (severity === 1 && frequency === 2) || (severity === 2 && frequency === 1)) return '#07C610';
  if ((severity === 3 && frequency === 1) || (severity === 1 && frequency === 3) || (severity === 2 && frequency === 2)) return '#FFDF78';
  if ((severity === 2 && frequency === 3) || (severity === 3 && frequency === 2) || (severity === 3 && frequency === 3)) return '#FF8E6A';
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
  classifications: ConfigurationsClassificationType[];
}

const ConfigComplexityMatrix: React.FC<ConfigComplexityMatrixProps> = ({ classifications }) => {
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
                    defaultValue={classifications[0].decision}
                    variant="outlined"
                    label=" "
                    sx={{ backgroundColor: 'white' }}
                    // inputProps={}
                  >
                    {classifications &&
                      classifications.map((option, index) => (
                        <MenuItem key={index} value={option.decision}>
                          {option.decision}
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
