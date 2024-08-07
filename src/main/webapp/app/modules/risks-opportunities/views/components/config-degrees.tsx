import { Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onAutocompleteChanged } from '../../utils';
import InputDegreeColor from './input-degree-color';
import TextDegreeWithBulletColor from './input-degree-color';
import {
  ConfigRow,
  ConfigTipoRos,
  ConfigurationsClassificationType,
  ConfigurationsDegreesType,
} from '../../models/config-risk-opportunity';

interface ConfigurationsDegreesProps {
  title: string;
  configValues?: ConfigRow[];
  setConfigValues?: React.Dispatch<React.SetStateAction<ConfigTipoRos>>;
  isDegree?: boolean;
}

const InputPropsTextFild = { readOnly: true };

const ConfigurationsDegrees = ({ title, configValues, setConfigValues, isDegree }: ConfigurationsDegreesProps) => {
  const [probability, setProbability] = useState<string>('');

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'grid', rowGap: 2 }}>
      <Typography variant="h5">{isDegree ? `Graus de ${title}` : `Classificação das ${title}`}</Typography>
      <Divider variant="fullWidth" sx={{ bgcolor: 'black', height: 1, marginX: -2 }} />
      {configValues.map(configItem => (
        <Stack direction="row" spacing={2}>
          {isDegree ? (
            <>
              <InputDegreeColor label="Grau" color={configItem.color} value={configItem.label} InputProps={InputPropsTextFild} />
              <TextField
                label="Peso"
                placeholder="Peso"
                value={configItem.weight}
                InputProps={InputPropsTextFild}
                sx={{ width: '140px' }}
              />
            </>
          ) : (
            <>
              <TextField
                label="Código"
                placeholder="Código"
                value={configItem.codigo}
                InputProps={InputPropsTextFild}
                sx={{ width: '140px' }}
              />
              <TextField
                label="Decisão"
                placeholder="Decisão"
                value={configItem.decision}
                InputProps={InputPropsTextFild}
                sx={{ width: '150px' }}
              />
            </>
          )}
          <TextField
            label="Descrição"
            placeholder={`Descrição do grau de ${title}`}
            value={configItem.description}
            InputProps={InputPropsTextFild}
            sx={{ flexGrow: 1 }}
          />
          {/* <TextField label="Descrição da decisão" maxRows={5} multiline placeholder="Descrição da decisão" sx={{ flexGrow: 1 }} /> */}
        </Stack>
      ))}
    </Paper>
  );
};

export default ConfigurationsDegrees;
