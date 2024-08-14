import { Circle, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Table } from 'reactstrap';
import { AnalysisSummary, Configuration, Enums, Option, RawMap, RawMapAxis, SummarizedUser } from '../../models';
import ActionPlan from './action-plan';
import AnalysisDetails from './analysis-details';
import CauseInvestigation from './cause-investigation';
import Closing from './closing';

type AnalysisProps = {
  enums: Enums;
  firstConfigurations: Array<Configuration>;
  secondConfigurations: Array<Configuration>;
  map: RawMap | null;
  readonly?: boolean;
  users: Array<SummarizedUser>;
};

const Analysis = ({ enums, firstConfigurations, map, secondConfigurations, readonly, users }: AnalysisProps) => {
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const { register, setValue, formState, control, trigger } = useFormContext();
  const actionDate = useWatch({ control, name: 'actionDate' });
  const description = useWatch({ control, name: 'description' });
  const probability = useWatch({ control, name: 'probability' });
  const severity = useWatch({ control, name: 'severity' });

  const getLabel = (configuration: Configuration | null): string => {
    const level: Option | null = getLevel(configuration);
    return level?.value ?? '';
  };

  const getLevel = (configuration: Configuration | null): Option | null => {
    if (!configuration || !enums || !enums.levelOptions) {
      return null;
    }

    const filteredLevels: Array<Option> = enums.levelOptions.filter(l => l.name === configuration.grauRO);
    return filteredLevels.length > 0 ? filteredLevels[0] : null;
  };

  const getColor = (level: string): string => {
    if (level === 'Baixo') {
      return 'lightgreen';
    } else if (level === 'Medio') {
      return 'lightgoldenrodyellow';
    } else {
      return 'lightsalmon';
    }
  };

  useEffect(() => {
    setAnalysisSummary({
      analysis: description,
      date: actionDate,
      decision: analysisDecisionDescription,
      probability: getLabel(probability),
      severity: getLabel(severity),
    });
  }, [actionDate, description, probability, severity]);

  const onAccordionChanged = (event: React.SyntheticEvent, expanded: boolean): void => {
    setExpanded(expanded);
  };

  const analysisDecision = useMemo(() => {
    if (!enums || !map || !probability || !severity) {
      return null;
    }

    const xLevel: Option | null = getLevel(probability);
    const yLevel: Option | null = getLevel(severity);

    if (!xLevel || !yLevel) {
      return null;
    }

    const x: number = xLevel.code;
    const y: number = yLevel.code;
    let decision: RawMapAxis | null = null;

    if (x === 2 && y === 2) {
      decision = map.decisaoEixo11;
    } else if (x === 2 && y === 1) {
      decision = map.decisaoEixo12;
    } else if (x === 2 && y === 0) {
      decision = map.decisaoEixo13;
    } else if (x === 1 && y === 2) {
      decision = map.decisaoEixo21;
    } else if (x === 1 && y === 1) {
      decision = map.decisaoEixo22;
    } else if (x === 1 && y === 0) {
      decision = map.decisaoEixo23;
    } else if (x === 0 && y === 2) {
      decision = map.decisaoEixo31;
    } else if (x === 0 && y === 1) {
      decision = map.decisaoEixo32;
    } else if (x === 0 && y === 0) {
      decision = map.decisaoEixo33;
    } else {
      return null;
    }

    return decision;
  }, [enums, map, probability, severity]);

  const analysisDecisionDescription = useMemo(() => {
    return analysisDecision?.descricaoRO ?? '-';
  }, [analysisDecision]);

  const analysisDecisionSummary = useMemo(() => {
    return analysisDecision?.decisaoRO ?? '-';
  }, [analysisDecision]);

  const points = useMemo(() => {
    if (!enums || !probability || !severity) {
      return -1;
    }

    const xLevel: Option | null = getLevel(probability);
    const yLevel: Option | null = getLevel(severity);

    if (!xLevel || !yLevel) {
      return -1;
    }

    const x: number = xLevel.code;
    const y: number = yLevel.code;

    if (x >= 0 && x <= 2 && y >= 0 && y <= 2) {
      return (x + 1) * (y + 1);
    } else {
      return -1;
    }
  }, [enums, probability, severity]);

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
                        <Circle sx={{ fill: getColor(analysisSummary.probability), marginRight: 50 }} />

                        {analysisSummary.probability}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Circle sx={{ fill: getColor(analysisSummary.severity), marginRight: 50 }} />

                        {analysisSummary.severity}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Circle sx={{ fill: 'lightskyblue', marginRight: 50 }} />

                        {analysisSummary.decision}
                      </Stack>
                    </TableCell>
                    <TableCell>{analysisDecisionSummary}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <AnalysisDetails
              description={analysisDecisionDescription}
              firstConfigurations={firstConfigurations}
              points={points}
              readonly={readonly}
              secondConfigurations={secondConfigurations}
            />

            <Divider />

            <CauseInvestigation readonly={readonly} />

            <Divider />

            <ActionPlan readonly={readonly} users={users} />

            <Divider />

            <Closing readonly={readonly} users={users} />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default Analysis;
