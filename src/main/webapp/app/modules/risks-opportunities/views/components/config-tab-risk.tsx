import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import ConfigurationsDegrees from './config-degrees';
import ConfigComplexityMatrix from './config-complexity-matrix';
import {
  ConfigRow,
  ConfigTipoRos,
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
    baixo: 'Existe controle operacional considerado robust',
    medio:
      'Os efeitos interferem não só localmente, mas interfere em outras áreas, em outras atividades e em partes interessadas internas ou Produto/serviço ocasionando atraso no processo.',
    alto: 'Os efeitos afetam fora do local de trabalho, externamente incluindo outras partes interessadas ou falha que ocasione recall no produto e/ou preju[izo financeiro significativo.',
  },
  classificacaoOportunidades: {
    primeira: {
      decisao: 'Aceitar o risco',
      descricao: 'Não obrigatório tratativa',
    },
    segunda: {
      decisao: 'Avaliar o risco',
      descricao: 'Prioridade 2 - Avaliar custo/ benefício (Tratativa de médio e longo prazo)',
    },
    terceira: {
      decisao: 'Reduzir o risco',
      descricao: 'Prioridade 1 (Tratativa imediata - curto prazo ou médio prazo)',
    },
  },
};

const ConfigurationsTabRisk = () => {
  const [riscoConfigs, setRiscoConfig] = useState<ConfiguracaoRiscoOportunidade>(configValuesMock);
  return (
    <Stack spacing={2} pt={2}>
      <ConfigurationsDegrees
        isDegree
        title="Probabilidade"
        configValues={riscoConfigs?.grausComplexidade}
        setConfigValues={setRiscoConfig}
      />
      <ConfigurationsDegrees isDegree title="Severidade" configValues={riscoConfigs?.grausMelhoria} />
      <ConfigurationsClassification title="Riscos" configValues={riscoConfigs?.classificacaoOportunidades} />
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

export default ConfigurationsTabRisk;
