import { Circle } from '@mui/icons-material';
import { Paper, Stack, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { AnalysisSummary } from '../../models';
import ActionPlan from './action-plan';
import AnalysisDetails from './analysis-details';
import CauseInvestigation from './cause-investigation';
import Closing from './closing';

const Analysis = () => {
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);

  useEffect(() => {
    setAnalysisSummary({
      analysis: 'Descrição da DECISÃO 1',
      date: new Date(),
      decision: 'Reduzir',
      probability: 'Baixo',
      severity: 'Alto',
    });
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Análise</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Probabilidade</TableCell>
              <TableCell>Severidade</TableCell>
              <TableCell>Decisão</TableCell>
              <TableCell>Análise</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analysisSummary && (
              <TableRow key={analysisSummary.analysis} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{analysisSummary.date.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Circle sx={{ fill: 'lightgreen', marginRight: 50 }} />

                    {analysisSummary.probability}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Circle sx={{ fill: 'lightsalmon', marginRight: 50 }} />

                    {analysisSummary.severity}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Circle sx={{ fill: 'lightgoldenrodyellow', marginRight: 50 }} />

                    {analysisSummary.decision}
                  </Stack>
                </TableCell>
                <TableCell>{analysisSummary.analysis}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AnalysisDetails />

      <CauseInvestigation />

      <ActionPlan />

      <Closing />
    </Stack>
  );
};

export default Analysis;
