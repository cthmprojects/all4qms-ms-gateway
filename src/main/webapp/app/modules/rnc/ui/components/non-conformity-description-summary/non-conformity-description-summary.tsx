import { Card, CardContent, CardHeader, Link, Stack, TextField } from '@mui/material';
import { NonConformityDescription, NonConformitySummarizedDescription } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityDescriptionSummaryProps = {
  descriptions: Array<NonConformityDescription>;
};

const NonConformityDescriptionSummary = ({ descriptions }: NonConformityDescriptionSummaryProps) => {
  return (
    <Card>
      <CardHeader title="Descrição" />
      <CardContent>
        <Stack spacing={2}>
          {descriptions?.map((description, index) => (
            <Stack spacing={2}>
              <TextField
                disabled
                label="Não conformidade"
                placeholder="Não conformidade"
                value={description?.descricaoNaoConformidade.detalhesNaoConformidade ?? ''}
              />
              <TextField
                disabled
                label="Requisito descumprido"
                placeholder="Requisito descumprido"
                value={description?.descricaoNaoConformidade.requisitoDescumprido ?? ''}
              />
              <TextField
                disabled
                label="Evidência objetiva"
                placeholder="Evidência objetiva"
                value={description?.descricaoNaoConformidade.evidenciaObjetiva ?? ''}
              />
              {description?.descricaoNaoConformidade.anexos.map((anexo, _) => {
                return <Link href={`services/all4qmsmsrnc/api/nao-conformidades/download/${anexo.id}`}>{anexo.nomeArquivoOriginal}</Link>;
              })}
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityDescriptionSummary;
