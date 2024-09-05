import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { NonConformityCauseEffect, NonConformityReason } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityCauseInvestigationSummaryProps = {
  ishikawa: NonConformityCauseEffect;
  reasons: Array<NonConformityReason>;
};

type IshikawaSummaryProps = {
  ishikawa: NonConformityCauseEffect;
};

const IshikawaSummary = ({ ishikawa }: IshikawaSummaryProps) => {
  return (
    <Card>
      <CardHeader title="Ishikawa" />
      <CardContent>
        <Stack direction="row" spacing={2}>
          <TextField disabled label="NC" placeholder="NC" value={ishikawa?.id} />

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField disabled label="Meio Ambiente" placeholder="Meio Ambiente" value={ishikawa?.meioAmbiente} />

              <TextField disabled label="Mão de Obra" placeholder="Mão de Obra" value={ishikawa?.maoDeObra} />

              <TextField disabled label="Método" placeholder="Método" value={ishikawa?.metodo} />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField disabled label="Máquina" placeholder="Máquina" value={ishikawa?.maquina} />

              <TextField disabled label="Medição" placeholder="Medição" value={ishikawa?.medicao} />

              <TextField disabled label="Matéria Prima" placeholder="Matéria Prima" value={ishikawa?.materiaPrima} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

type ReasonSummaryProps = {
  reason: NonConformityReason;
};

const ReasonSummary = ({ reason }: ReasonSummaryProps) => {
  return (
    <Card>
      <CardHeader title="5 Porquês" />
      <CardContent>
        <Stack direction="row" spacing={2}>
          <TextField disabled label="NC" placeholder="NC" value={reason?.id} />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <TextField disabled label="Porquê?" placeholder="Porquê?" value={reason?.pq1} />
            <TextField disabled label="Porquê?" placeholder="Porquê?" value={reason?.pq2} />
            <TextField disabled label="Porquê?" placeholder="Porquê?" value={reason?.pq3} />
            <TextField disabled label="Porquê?" placeholder="Porquê?" value={reason?.pq4} />
            <TextField disabled label="Porquê?" placeholder="Porquê?" value={reason?.pq5} />
          </Stack>

          <TextField disabled label="Causa" placeholder="Causa" value={reason?.descCausa} />
        </Stack>
      </CardContent>
    </Card>
  );
};

const NonConformityCauseInvestigationSummary = ({ ishikawa, reasons }: NonConformityCauseInvestigationSummaryProps) => {
  return (
    <Card>
      <CardHeader title="Investigação de Causas" />
      <CardContent>
        <Stack spacing={2}>
          {ishikawa && <IshikawaSummary ishikawa={ishikawa} />}
          {reasons && reasons.map((reason, index) => <ReasonSummary key={index} reason={reason} />)}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityCauseInvestigationSummary;
