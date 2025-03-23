import { Add } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Fab, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useMemo } from 'react';
import { Analysis } from '../../models';

type IndicatorMeasurementAnalysisInformationProps = {
  analysis: Analysis;
  users: Array<any>;
  onChanged: (analysis: Analysis) => void;
};

const IndicatorMeasurementAnalysisInformation = ({ analysis, users, onChanged }: IndicatorMeasurementAnalysisInformationProps) => {
  const action = useMemo(() => analysis?.action ?? '', [analysis]);
  const analysisDetails = useMemo(() => analysis?.analysisDetails ?? '', [analysis]);
  const deadline = useMemo(() => analysis?.deadline ?? '', [analysis]);
  const description = useMemo(() => analysis?.description ?? '', [analysis]);
  const responsible = useMemo(() => analysis?.responsible ?? '', [analysis]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Análise crítica do desempenho"
          onChange={event => onChanged({ ...analysis, analysisDetails: event.target.value })}
          placeholder="Análise crítica do desempenho"
          sx={{ width: '100%' }}
          value={analysisDetails}
        />
      </Grid>

      <Grid item xs={3}>
        <TextField
          label="O que será feito?"
          onChange={event => onChanged({ ...analysis, action: event.target.value })}
          placeholder="O que será feito?"
          sx={{ width: '100%' }}
          value={action}
        />
      </Grid>

      <Grid item xs={3}>
        <Select
          label="Quem"
          name="responsible"
          onChange={e => onChanged({ ...analysis, responsible: parseInt(e.target.value as string) })}
          value={responsible}
          sx={{ width: '100%' }}
        >
          {users.map((user, i) => (
            <MenuItem value={user.id} key={`user-${i}`}>
              {user.nome}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item xs={3}>
        <TextField
          label="Quando"
          onChange={event => onChanged({ ...analysis, deadline: event.target.value })}
          placeholder="Quando"
          sx={{ width: '100%' }}
          value={deadline}
        />
      </Grid>

      <Grid item xs={3}>
        <TextField
          label="Como"
          onChange={event => onChanged({ ...analysis, description: event.target.value })}
          placeholder="Como"
          sx={{ width: '100%' }}
          value={description}
        />
      </Grid>
    </Grid>
  );
};

type IndicatorMeasurementAnalysisProps = {
  allAnalysisInformation: Array<Analysis>;
  label: string;
  users: Array<any>;
  onChanged: (allAnalysisInformation: Array<Analysis>) => void;
};

const IndicatorMeasurementAnalysis = ({ allAnalysisInformation, label, users, onChanged }: IndicatorMeasurementAnalysisProps) => {
  const onAdded = (): void => {
    const data: Array<Analysis> = [...allAnalysisInformation];
    data.push({
      action: '',
      analysisDetails: '',
      deadline: '',
      description: '',
      indicatorGoal: null,
      indicatorGoalId: -1,
      month: -1,
      responsible: -1,
    });
    onChanged(data);
  };

  const updateAllAnalysisInformation = (analysis: Analysis, index: number): void => {
    const data: Array<Analysis> = [...allAnalysisInformation];
    data[index] = analysis;
    onChanged(data);
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardHeader
          title={`Análises ${label}`}
          action={
            <Fab aria-label="add" size="medium" className="btn-add-fab me-2 ms-2" onClick={onAdded}>
              <Add />
            </Fab>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {allAnalysisInformation.map((analysis, idx) => (
              <IndicatorMeasurementAnalysisInformation
                analysis={analysis}
                key={`analysis-information-${idx}`}
                onChanged={analysis => updateAllAnalysisInformation(analysis, idx)}
                users={users}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default IndicatorMeasurementAnalysis;
