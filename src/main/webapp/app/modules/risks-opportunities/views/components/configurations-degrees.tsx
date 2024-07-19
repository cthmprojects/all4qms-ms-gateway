import { Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onAutocompleteChanged } from '../../utils';
import InputDegreeColor from './input-degree-color';
import TextDegreeWithBulletColor from './input-degree-color';

export type ConfigurationsDegreesType = {
  label: string;
  color: string;
  weight: number;
  description: string;
};

interface ConfigurationsDegreesProps {
  title: string;
  degreeValues: ConfigurationsDegreesType[];
  // setDegreeValues?: React.Dispatch<React.SetStateAction<Degrees>>;
}

const InputPropsTextFild = { readOnly: true };

const ConfigurationsDegrees = ({ title, degreeValues }: ConfigurationsDegreesProps) => {
  const [probability, setProbability] = useState<string>('');

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'grid', rowGap: 2 }}>
      <Typography variant="h5">Graus de {title}</Typography>
      <Divider variant="fullWidth" sx={{ bgcolor: 'black', height: 1, marginX: -2 }} />
      {degreeValues.map(degreeItem => (
        <Stack direction="row" spacing={2}>
          <InputDegreeColor label="Grau" color={degreeItem.color} value={degreeItem.label} InputProps={InputPropsTextFild} />
          <TextField label="Peso" placeholder="Peso" value={degreeItem.weight} InputProps={InputPropsTextFild} />
          <TextField
            label="Descrição"
            placeholder={`Descrição do grau de ${title}`}
            value={degreeItem.description}
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
