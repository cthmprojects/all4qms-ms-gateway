import { Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { NonConformityActionPlan } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityActionPlanSummaryProps = {
  actionPlan: NonConformityActionPlan;
};

const NonConformityActionPlanSummary = ({ actionPlan }: NonConformityActionPlanSummaryProps) => {
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
      <CardHeader title="Plano de Ação Corretiva" />
      <CardContent>
        <Stack spacing={2}>
          {actionPlan.acoes.map((a, index) => (
            <Stack spacing={2} key={index}>
              <TextField disabled label="Descrição da Ação" placeholder="Descrição da Ação" value={a?.descricaoAcao} />

              <Stack direction="row" spacing={2}>
                <TextField disabled label="Prazo" placeholder="Prazo" value={formatTimestamp(a?.prazoAcao)} />
                <TextField disabled label="Responsável" placeholder="Responsável" value={a?.idResponsavelAcao} />
                <TextField disabled label="Status" placeholder="Status" value={a?.statusAcao} />
                <TextField disabled label="Verificação" placeholder="Verificação" value={formatTimestamp(a?.dataVerificao)} />
                <TextField
                  disabled
                  label="Responsável verificação"
                  placeholder="Responsável verificação"
                  value={a?.idResponsavelVerificaoAcao}
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityActionPlanSummary;
