import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import ConfigurationsDegrees from './config-degrees';
import ConfigComplexityMatrix from './config-complexity-matrix';
import {
  ConfigRow,
  ConfigTipoRos,
  ConfigurationsClassificationType,
  ConfigurationsDegreesType,
} from '../../models/config-risk-opportunity';

type ConfigurationsType = {
  probabilityDegrees: ConfigurationsDegreesType[];
  severityDegrees: ConfigurationsDegreesType[];
  risksClassification: ConfigurationsClassificationType[];
};

const configValuesMock: ConfigurationsType = {
  probabilityDegrees: [
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
  severityDegrees: [
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
  risksClassification: [
    {
      codigo: 1,
      decision: 'Aceitar o risco',
      description: 'Não obrigatório tratativa',
    },
    {
      codigo: 2,
      decision: 'Avaliar o risco',
      description: 'Prioridade 2 - Avaliar custo/ benefício (Tratativa de médio e longo prazo)',
    },
    {
      codigo: 3,
      decision: 'Reduzir o risco',
      description: 'Prioridade 1 (Tratativa imediata - curto prazo ou médio prazo)',
    },
  ],
};

const ConfigurationsTabRisk = () => {
  const [riscoConfigs, setRiscoConfig] = useState<ConfigTipoRos>();
  return (
    <Stack spacing={2} pt={2}>
      <ConfigurationsDegrees isDegree title="Probabilidade" configValues={riscoConfigs?.linhaConfig1} setConfigValues={setRiscoConfig} />
      <ConfigurationsDegrees isDegree title="Severidade" configValues={riscoConfigs?.linhaConfig2} />
      <ConfigurationsDegrees title="Riscos" configValues={riscoConfigs?.linhaConfigDecisao} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ConfigComplexityMatrix classifications={configValuesMock.risksClassification} />
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

export default ConfigurationsTabRisk;
