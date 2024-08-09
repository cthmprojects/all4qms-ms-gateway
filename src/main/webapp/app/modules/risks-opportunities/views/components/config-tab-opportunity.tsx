import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import ConfigurationsDegrees from './config-degrees';
import ConfigComplexityMatrix from './config-complexity-matrix';
import {
  ConfiguracaoRiscoOportunidade,
  ConfigurationsClassificationType,
  ConfigurationsDegreesType,
} from '../../models/config-risk-opportunity';
import ConfigurationsClassification from './config-classification';

const configValuesMock: ConfiguracaoRiscoOportunidade = {
  grausComplexidade: {
    baixo: 'Não há controle operacional',
    medio: 'Existe controle operacional, mas não é suficiente para evitar o risco',
    alto: 'Existe controle operacional considerado robusto',
  },
  grausMelhoria: {
    baixo:
      'Os danos servo local, no processo. Não interferem em outras atividades, em outras partes interessadas ou afeta a performance do produto/ serviço e entrega',
    medio:
      'Os efeitos interferem não só localmente, mas interfere em outras áreas, em outras atividades e em partes interessadas internas ou Produto/serviço ocasionando atraso no processo.',
    alto: 'Os efeitos afetam fora do local de trabalho, externamente incluindo outras partes interessadas ou falha que ocasione recall no produto e/ou preju[izo financeiro significativo.',
  },
  classificacaoOportunidades: {
    primeira: {
      decisao: 'Não implementar',
      descricao:
        'Os danos servo local, no processo. Não interferem em outras atividades, em outras partes interessadas ou afeta a performance do produto/ serviço e entrega',
    },
    segunda: {
      decisao: 'Avaliar',
      descricao:
        'Os efeitos interferem não só localmente, mas interfere em outras áreas, em outras atividades e em partes interessadas internas ou Produto/serviço ocasionando atraso no processo',
    },
    terceira: {
      decisao: 'Implementar',
      descricao:
        'Os efeitos afetam fora do local de trabalho, externamente incluindo outras partes interessadas ou falha que ocasione recall no produto e/ou preju[izo financeiro significativo.',
    },
  },
};

type BaseDetailsProps = {
  isOpportunity?: boolean;
  readonly?: boolean;
};

const ConfigurationsTabOpportunity = ({ isOpportunity, readonly }: BaseDetailsProps) => {
  return (
    <Stack spacing={2} pt={2}>
      <ConfigurationsDegrees isDegree title="Complexidade" configValues={configValuesMock?.grausComplexidade} />
      <ConfigurationsDegrees isDegree title="Melhoria" configValues={configValuesMock?.grausMelhoria} />
      <ConfigurationsClassification title="Oportunidades" configValues={configValuesMock?.classificacaoOportunidades} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ConfigComplexityMatrix classifications={configValuesMock?.classificacaoOportunidades} />
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
