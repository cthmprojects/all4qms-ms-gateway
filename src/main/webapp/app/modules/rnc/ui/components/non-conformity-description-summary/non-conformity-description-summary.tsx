import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { NonConformityDescription } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityDescriptionSummaryProps = {
  description: NonConformityDescription;
};

const NonConformityDescriptionSummary = ({ description }: NonConformityDescriptionSummaryProps) => {
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
      <CardHeader title={`Detalhes: ${description?.descricaoNaoConformidade.detalhesNaoConformidade}`} />
      <CardContent>
        <Stack spacing={2}>
          <Typography>{`Evidência: ${description?.descricaoNaoConformidade.evidenciaObjetiva}`}</Typography>
          <Typography>{`Requisito: ${description?.descricaoNaoConformidade.requisitoDescumprido}`}</Typography>
          <Typography>{`Criado em: ${formatTimestamp(description?.descricaoNaoConformidade.criadoEm)}`}</Typography>
          <Typography>{`Última atualização: ${formatTimestamp(description?.descricaoNaoConformidade.atualizadoEm)}`}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityDescriptionSummary;
