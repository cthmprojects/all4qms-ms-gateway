import { Card, CardContent, CardHeader, Link, Stack, TextField } from '@mui/material';
import { NonConformitySummarizedDescription } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityDescriptionSummaryProps = {
  description: NonConformitySummarizedDescription;
};

const NonConformityDescriptionSummary = ({ description }: NonConformityDescriptionSummaryProps) => {
  return (
    <Card>
      <CardHeader title="Descrição" />
      <CardContent>
        <Stack spacing={2}>
          <TextField disabled label="Não conformidade" placeholder="Não conformidade" value={description?.detalhesNaoConformidade ?? ''} />
          <TextField
            disabled
            label="Requisito descumprido"
            placeholder="Requisito descumprido"
            value={description?.requisitoDescumprido ?? ''}
          />
          <Stack spacing={2}>
            {description?.evidencias.map((evidence, index) => (
              <Stack>
                <TextField disabled label="Evidência objetiva" placeholder="Evidência objetiva" value={evidence.evidencia ?? ''} />
                {evidence.nomeAnexo && evidence.idAnexo && (
                  <Link href={`services/all4qmsmsrnc/api/nao-conformidades/download/${evidence.idAnexo}`}>{evidence.nomeAnexo}</Link>
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityDescriptionSummary;
