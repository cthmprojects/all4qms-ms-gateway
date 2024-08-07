import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import ConfigurationsDegrees from './config-degrees';
import ConfigComplexityMatrix from './config-complexity-matrix';
import { ConfigurationsClassificationType, ConfigurationsDegreesType } from '../../models/config-risk-opportunity';

type ConfigurationsType = {
  complexityDegrees: ConfigurationsDegreesType[];
  improvimentDegrees: ConfigurationsDegreesType[];
  opportunitiesClassification: ConfigurationsClassificationType[];
};

const configValuesMock: ConfigurationsType = {
  complexityDegrees: [
    {
      label: 'Baixo',
      color: '#07C610',
      weight: 1,
      description: 'Não há controle operacional',
    },
    {
      label: 'Médio',
      color: '#FFDF78',
      weight: 2,
      description: 'Existe controle operacional, mas não é suficiente para evitar o risco',
    },
    {
      label: 'Alto',
      color: '#FF8E6A',
      weight: 3,
      description: 'Existe controle operacional considerado robusto',
    },
  ],
  improvimentDegrees: [
    {
      label: 'Baixo',
      color: '#07C610',
      weight: 1,
      description:
        'Os danos servo local, no processo. Não interferem em outras atividades, em outras partes interessadas ou afeta a performance do produto/ serviço e entrega',
    },
    {
      label: 'Médio',
      color: '#FFDF78',
      weight: 2,
      description:
        'Os efeitos interferem não só localmente, mas interfere em outras áreas, em outras atividades e em partes interessadas internas ou Produto/serviço ocasionando atraso no processo.',
    },
    {
      label: 'Alto',
      color: '#FF8E6A',
      weight: 3,
      description:
        'Os efeitos afetam fora do local de trabalho, externamente incluindo outras partes interessadas ou falha que ocasione recall no produto e/ou preju[izo financeiro significativo.',
    },
  ],
  opportunitiesClassification: [
    {
      codigo: 1,
      decision: 'Não implementar',
      description:
        'Os danos servo local, no processo. Não interferem em outras atividades, em outras partes interessadas ou afeta a performance do produto/ serviço e entrega',
    },
    {
      codigo: 2,
      decision: 'Avaliar',
      description:
        'Os efeitos interferem não só localmente, mas interfere em outras áreas, em outras atividades e em partes interessadas internas ou Produto/serviço ocasionando atraso no processo.',
    },
    {
      codigo: 3,
      decision: 'Implementar',
      description:
        'Os efeitos afetam fora do local de trabalho, externamente incluindo outras partes interessadas ou falha que ocasione recall no produto e/ou preju[izo financeiro significativo.',
    },
  ],
};

type BaseDetailsProps = {
  isOpportunity?: boolean;
  readonly?: boolean;
};

const ConfigurationsTabOpportunity = ({ isOpportunity, readonly }: BaseDetailsProps) => {
  return (
    <Stack spacing={2} pt={2}>
      <ConfigurationsDegrees isDegree title="Complexidade" configValues={configValuesMock.complexityDegrees} />
      <ConfigurationsDegrees isDegree title="Melhoria" configValues={configValuesMock.improvimentDegrees} />
      <ConfigurationsDegrees title="Oportunidades" configValues={configValuesMock.opportunitiesClassification} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ConfigComplexityMatrix classifications={configValuesMock.opportunitiesClassification} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2, pt: 5, pr: 6 }}>
        <Button variant="contained" size="large" sx={{ bgcolor: '#E0E0E0', color: 'black' }}>
          VOLTAR
        </Button>
        <Button variant="contained" size="large" sx={{ bgcolor: '#EBC139', color: 'black' }}>
          SALVAR
        </Button>
      </Box>
    </Stack>
  );
};

export default ConfigurationsTabOpportunity;
