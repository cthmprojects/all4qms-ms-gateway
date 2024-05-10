import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { NonConformityImmediateAction } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityImmediateActionSummaryProps = {
  immediateAction: NonConformityImmediateAction;
};

const NonConformityImmediateActionSummary = ({ immediateAction }: NonConformityImmediateActionSummaryProps) => {
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
      <CardHeader title="Descrição" />
      <CardContent>
        <Stack spacing={2}>
          <TextField disabled label="Descrição da ação" placeholder="Descrição da ação" value={immediateAction?.descricaoAcaoImediata} />

          <Stack direction="row" spacing={2}>
            <TextField disabled label="Prazo" placeholder="Prazo" value={formatTimestamp(immediateAction?.prazoAcaoImediata)} />

            <TextField disabled label="Responsável" placeholder="Responsável" value={immediateAction?.idResponsavelAcaoImediata} />

            <TextField disabled label="Status" placeholder="Status" value={immediateAction?.statusAcaoImediata} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityImmediateActionSummary;
