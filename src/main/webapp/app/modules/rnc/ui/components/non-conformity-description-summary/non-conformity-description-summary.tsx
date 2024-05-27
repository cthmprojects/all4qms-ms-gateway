import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { NonConformityDescription } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityDescriptionSummaryProps = {
  description: NonConformityDescription;
};

const NonConformityDescriptionSummary = ({ description }: NonConformityDescriptionSummaryProps) => {
  return (
    <Card>
      <CardHeader title="Descrição" />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            disabled
            label="Não conformidade"
            placeholder="Não conformidade"
            value={description?.descricaoNaoConformidade.detalhesNaoConformidade}
          />
          <TextField
            disabled
            label="Requisito descumprido"
            placeholder="Requisito descumprido"
            value={description?.descricaoNaoConformidade.requisitoDescumprido}
          />
          <TextField
            disabled
            label="Evidência objetiva"
            placeholder="Evidência objetiva"
            value={description?.descricaoNaoConformidade.evidenciaObjetiva}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityDescriptionSummary;
