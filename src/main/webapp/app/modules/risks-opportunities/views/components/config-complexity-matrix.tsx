import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { ConfigurationsClassificationType } from './config-degrees';
import { RawMap } from '../../models';

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
  map: RawMap | null;
  onChanged: (value: number, row: number, column: number) => void;
}

const ConfigComplexityMatrix: React.FC<ConfigComplexityMatrixProps> = ({ classifications, map, onChanged }) => {
  const [matrix, setMatrix] = useState<Array<Array<number>>>([]);

  useEffect(() => {
    const newMatrix: Array<Array<number>> = [];

    if (!map) {
      newMatrix.push([1, 1, 1]);
      newMatrix.push([1, 1, 1]);
      newMatrix.push([1, 1, 1]);
    } else {
      newMatrix.push([
        getClassificationByCode(map.decisaoEixo11?.pesoRO ?? 1),
        getClassificationByCode(map.decisaoEixo12?.pesoRO ?? 1),
        getClassificationByCode(map.decisaoEixo13?.pesoRO ?? 1),
      ]);
      newMatrix.push([
        getClassificationByCode(map.decisaoEixo21?.pesoRO ?? 1),
        getClassificationByCode(map.decisaoEixo22?.pesoRO ?? 1),
        getClassificationByCode(map.decisaoEixo23?.pesoRO ?? 1),
      ]);
      newMatrix.push([
        getClassificationByCode(map.decisaoEixo31?.pesoRO ?? 1),
        getClassificationByCode(map.decisaoEixo32?.pesoRO ?? 1),
        getClassificationByCode(map.decisaoEixo33?.pesoRO ?? 1),
      ]);
    }

    setMatrix(newMatrix);
  }, [map]);

  const getClassificationByCode = (code: number): number => {
    const filteredClassifications: Array<ConfigurationsClassificationType> = classifications.filter(c => c.codigo === code);
    return filteredClassifications.length > 0 ? filteredClassifications[0].codigo : 1;
  };

  const getMatrixValue = (row: number, column: number, defaultValue: number): number => {
    if (!map || !matrix || matrix.length === 0) {
      return defaultValue;
    }

    return matrix[row - 1][column - 1];
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
                    value={getMatrixValue(linha, coluna, classifications[0].codigo)}
                    variant="outlined"
                    label=" "
                    sx={{ backgroundColor: 'white' }}
                    onChange={(event, child) => {
                      const row: number = linha;
                      const column: number = coluna;
                      const value: number = event.target.value as number;

                      onChanged(value, row, column);
                    }}
                    // inputProps={}
                  >
                    {classifications &&
                      classifications.map((option, index) => (
                        <MenuItem key={index} value={option.codigo}>
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
