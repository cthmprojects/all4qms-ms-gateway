import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { NonConformity } from 'app/modules/rnc/models';
import React from 'react';

type NonConformitySummaryProps = {
  nonConformity: NonConformity | null;
};

const NonConformitySummary = ({ nonConformity }: NonConformitySummaryProps) => {
  const formatTimestamp = (timestamp: Date): string => {
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
      <CardHeader title={`ID: ${nonConformity?.id}`} />
      <CardContent>
        <Stack spacing={2}>
          <Typography>{`Criado em: ${formatTimestamp(nonConformity?.criadoEm)}`}</Typography>
          <Typography>{`Status: ${nonConformity?.statusAtual}`}</Typography>
          <Typography>{`Última atualização: ${formatTimestamp(nonConformity?.atualizadoEm)}`}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformitySummary;
