import { Circle, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { AnalysisSummary } from '../../models';
import ActionPlan from './action-plan';
import AnalysisDetails from './analysis-details';
import CauseInvestigation from './cause-investigation';
import Closing from './closing';

const Analysis = () => {
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    setAnalysisSummary({
      analysis: 'Descrição da DECISÃO 1',
      date: new Date(),
      decision: 'Reduzir',
      probability: 'Baixo',
      severity: 'Alto',
    });
  }, []);

  const onAccordionChanged = (event: React.SyntheticEvent, expanded: boolean): void => {
    setExpanded(expanded);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Análise</Typography>
      <Accordion expanded={expanded} onChange={onAccordionChanged}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <TableContainer sx={{ marginRight: 5 }}>
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
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <AnalysisDetails />

            <Divider />

            <CauseInvestigation />

            <Divider />

            <ActionPlan />

            <Divider />

            <Closing />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default Analysis;
