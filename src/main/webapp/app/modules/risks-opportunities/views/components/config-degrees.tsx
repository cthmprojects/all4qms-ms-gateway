import { Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onAutocompleteChanged } from '../../utils';
import InputDegreeColor from './input-degree-color';
import TextDegreeWithBulletColor from './input-degree-color';
import {
  ClassificacaoOportunidades,
  ConfigRow,
  ConfigTipoRos,
  ConfiguracaoRiscoOportunidade,
  ConfigurationsClassificationType,
  ConfigurationsDegreesType,
  Graus,
} from '../../models/config-risk-opportunity';

interface ConfigurationsDegreesProps {
  title: string;
  configValues?: Graus;
  setConfigValues?: React.Dispatch<React.SetStateAction<ConfiguracaoRiscoOportunidade>>;
  isDegree?: boolean;
}

const InputPropsTextFild = { readOnly: true };

const ConfigurationsDegrees = ({ title, configValues, setConfigValues, isDegree }: ConfigurationsDegreesProps) => {
  const [probability, setProbability] = useState<string>('');

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'grid', rowGap: 2 }}>
      <Typography variant="h5">{isDegree ? `Graus de ${title}` : `Classificação das ${title}`}</Typography>
      <Divider variant="fullWidth" sx={{ bgcolor: 'black', height: 1, marginX: -2 }} />
      <Stack direction="row" spacing={2}>
        <InputDegreeColor label="Grau" color={'#07C610'} value={'Baixo'} InputProps={InputPropsTextFild} />
        <TextField label="Peso" placeholder="Peso" value={1} InputProps={InputPropsTextFild} sx={{ width: '140px' }} />
        <TextField
          label="Descrição"
          placeholder={`Descrição do grau de ${title}`}
          value={configValues?.baixo}
          InputProps={InputPropsTextFild}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <InputDegreeColor label="Grau" color={'#FFDF78'} value={'Médio'} InputProps={InputPropsTextFild} />
        <TextField label="Peso" placeholder="Peso" value={2} InputProps={InputPropsTextFild} sx={{ width: '140px' }} />
        <TextField
          label="Descrição"
          placeholder={`Descrição do grau de ${title}`}
          value={configValues?.baixo}
          InputProps={InputPropsTextFild}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <InputDegreeColor label="Grau" color={'#FF8E6A'} value={'Alto'} InputProps={InputPropsTextFild} />
        <TextField label="Peso" placeholder="Peso" value={3} InputProps={InputPropsTextFild} sx={{ width: '140px' }} />
        <TextField
          label="Descrição"
          placeholder={`Descrição do grau de ${title}`}
          value={configValues?.baixo}
          InputProps={InputPropsTextFild}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
    </Paper>
  );
};

export default ConfigurationsDegrees;
