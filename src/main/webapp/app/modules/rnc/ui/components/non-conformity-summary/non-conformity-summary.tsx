import { Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material';
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
      <CardHeader title="Visualização" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField disabled label="Nº" placeholder="Nº" value={nonConformity?.numNC} />
            <TextField disabled label="Emitido por" placeholder="Emitido por" value={nonConformity?.idEmissorNC} />
            <TextField disabled label="Processo ou Empresa" placeholder="Processo ou Empresa" value={nonConformity?.processoEmissor} />
            <TextField disabled label="Encaminhado para" placeholder="Encaminhado para" value={nonConformity?.idReceptorNC} />
            <TextField disabled label="Processo ou Empresa" placeholder="Processo ou Empresa" value={nonConformity?.processoNC} />
            <TextField disabled label="Data" placeholder="Data" value={formatTimestamp(nonConformity?.dtNC)} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField disabled label="Tipo" placeholder="Tipo" value={nonConformity?.tipoNC} />
            <TextField disabled label="Origem" placeholder="Origem" value={nonConformity?.origemNC} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformitySummary;
