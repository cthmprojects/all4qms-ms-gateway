import { Card, CardContent, CardHeader, Chip, Stack, TextField } from '@mui/material';
import { NonConformityDecision } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityDecisionSummaryProps = {
  decision: NonConformityDecision;
};

const NonConformityDecisionSummary = ({ decision }: NonConformityDecisionSummaryProps) => {
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
      <CardHeader title="Decisão sobre Matéria-Prima/Insumo ou Decisão sobre Produto Acabado" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField disabled label="Decisão" placeholder="Decisão" value={decision?.tipoDecisao} />
            <TextField disabled label="Descrição da Decisão" placeholder="Descrição da Decisão" value={decision?.descricaoDecisao} />
            <TextField
              disabled
              label="Data Implementação"
              placeholder="Data Implementação"
              value={formatTimestamp(decision?.dataDecisao)}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField disabled label="Responsável" placeholder="Responsável" value={decision?.responsaveis} />
            <TextField disabled label="Quantidade selecionada" placeholder="Quantidade selecionada" value={decision?.qtdAtual} />
            <TextField disabled label="Quantidade aprovada" placeholder="Quantidade aprovada" value={decision?.qtdAprovada} />
            <TextField disabled label="Quantidade reprovada" placeholder="Quantidade reprovada" value={decision?.qtdReprovada} />
            <TextField disabled label="Quantidade rejeitada" placeholder="Quantidade rejeitada" value={decision?.qtdRejeitada} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityDecisionSummary;
