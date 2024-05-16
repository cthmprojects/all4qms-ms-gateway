import { Card, CardContent, CardHeader, Chip, Stack } from '@mui/material';
import { NonConformityCoverage } from 'app/modules/rnc/models';
import React from 'react';

type NonConformityCoverageSummaryProps = {
  coverage: NonConformityCoverage;
};

const NonConformityCoverageSummary = ({ coverage }: NonConformityCoverageSummaryProps) => {
  return (
    <Card>
      <CardHeader title="Análise de Abrangência da NC" />
      <CardContent>
        <Stack spacing={2}>
          <div className="p-2 mt-3" style={{ width: '100%', border: '1px solid #c6c6c6', borderRadius: '4px', minHeight: '100px' }}>
            {coverage?.descricaoAbrangencia.split(';').map((keyword: string, index: number) => (
              <Chip disabled label={keyword} className="me-2" />
            ))}
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityCoverageSummary;
