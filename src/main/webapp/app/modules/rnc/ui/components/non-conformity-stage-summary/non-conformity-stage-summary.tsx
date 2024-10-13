import { Card, CardContent, CardHeader, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';

type NonConformityStageSummaryProps = {
  available: boolean;
  date: Date;
  dateLabel: string;
  description: string;
  descriptionLabel: string;
  responsible: string;
  responsibleLabel: string;
  showAvailability: boolean;
  title: string;
};

const NonConformityStageSummary = ({
  available,
  date,
  dateLabel,
  description,
  descriptionLabel,
  responsible,
  responsibleLabel,
  showAvailability,
  title,
}: NonConformityStageSummaryProps) => {
  const formatTimestamp = (timestamp: Date): string => {
    if (!timestamp) {
      return '';
    }

    const date: Date = new Date(timestamp);
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const seconds: number = date.getSeconds();

    const yearStr: string = year.toString().padStart(4, '0');
    const monthStr: string = month.toString().padStart(2, '0');
    const dayStr: string = day.toString().padStart(2, '0');
    const hoursStr: string = hours.toString().padStart(2, '0');
    const minutesStr: string = minutes.toString().padStart(2, '0');
    const secondsStr: string = seconds.toString().padStart(2, '0');

    return `${yearStr}/${monthStr}/${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            {showAvailability && (
              <>
                <FormControlLabel control={<Checkbox />} disabled label="Sim" checked={available} />
                <FormControlLabel control={<Checkbox />} disabled label="Não" checked={!available} />
              </>
            )}
            <TextField disabled label={dateLabel} placeholder={dateLabel} value={formatTimestamp(date)} />
            <TextField disabled label={responsibleLabel} placeholder={responsibleLabel} value={responsible} />
          </Stack>
          <Stack spacing={2}>
            <TextField disabled label={descriptionLabel} placeholder={descriptionLabel} value={description} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityStageSummary;
