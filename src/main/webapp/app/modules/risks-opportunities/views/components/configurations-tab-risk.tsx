import { Stack } from '@mui/material';
import React from 'react';
import Analysis from './analysis';
import ControlAction from './control-action';
import GeneralInformation from './general-information';
import ConfigurationsDegrees, { ConfigurationsDegreesType } from './configurations-degrees';

type ConfigurationsType = {
  probabilityDegrees: ConfigurationsDegreesType[];
  severityDegrees: ConfigurationsDegreesType[];
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
};

type BaseDetailsProps = {
  isOpportunity?: boolean;
  readonly?: boolean;
};

const ConfigurationsTabRisk = ({ isOpportunity, readonly }: BaseDetailsProps) => {
  return (
    <Stack spacing={2} pt={2}>
      <ConfigurationsDegrees title="Probabilidade" degreeValues={configValuesMock.probabilityDegrees} />
      <ConfigurationsDegrees title="Severidade" degreeValues={configValuesMock.severityDegrees} />
    </Stack>
  );
};

export default ConfigurationsTabRisk;
