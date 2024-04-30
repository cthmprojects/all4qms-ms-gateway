import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { NonConformity } from 'app/modules/rnc/models';
import React from 'react';

type NonConformitySummaryProps = {
  nonConformity: NonConformity | null;
};

const NonConformitySummary = ({ nonConformity }: NonConformitySummaryProps) => {
  return (
    <Card>
      <CardHeader title={`ID: ${nonConformity?.id}`} />
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Typography>{`Status: ${nonConformity?.statusAtual}`}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformitySummary;
