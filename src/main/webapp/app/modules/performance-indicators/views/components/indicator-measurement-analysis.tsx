import { Card, CardContent, CardHeader, Grid, Stack, TextField } from '@mui/material';

type IndicatorMeasurementAnalysisProps = {
  action: string;
  analysisDetails: string;
  deadline: string;
  description: string;
  label: string;
  onActionChanged: (action: string) => void;
  onAnalysisDetailsChanged: (analysisDetails: string) => void;
  onDeadlineChanged: (deadline: string) => void;
  onDescriptionChanged: (description: string) => void;
  onResponsibleChanged: (responsible: string) => void;
  responsible: string;
};

const IndicatorMeasurementAnalysis = ({
  action,
  analysisDetails,
  deadline,
  description,
  label,
  onActionChanged,
  onAnalysisDetailsChanged,
  onDeadlineChanged,
  onDescriptionChanged,
  onResponsibleChanged,
  responsible,
}: IndicatorMeasurementAnalysisProps) => {
  return (
    <Stack spacing={2}>
      <Card>
        <CardHeader title={`Análise ${label}`} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Análise crítica do desempenho"
                onChange={event => onAnalysisDetailsChanged(event.target.value)}
                placeholder="Análise crítica do desempenho"
                sx={{ width: '100%' }}
                value={analysisDetails}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="O que será feito?"
                onChange={event => onActionChanged(event.target.value)}
                placeholder="O que será feito?"
                sx={{ width: '100%' }}
                value={action}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Quem"
                onChange={event => onResponsibleChanged(event.target.value)}
                placeholder="Quem"
                sx={{ width: '100%' }}
                value={responsible}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Quando"
                onChange={event => onDeadlineChanged(event.target.value)}
                placeholder="Quando"
                sx={{ width: '100%' }}
                value={deadline}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Como"
                onChange={event => onDescriptionChanged(event.target.value)}
                placeholder="Como"
                sx={{ width: '100%' }}
                value={description}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default IndicatorMeasurementAnalysis;
