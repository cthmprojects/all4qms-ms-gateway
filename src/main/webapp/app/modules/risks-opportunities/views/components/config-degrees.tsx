import { Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onAutocompleteChanged } from '../../utils';
import InputDegreeColor from './input-degree-color';
import TextDegreeWithBulletColor from './input-degree-color';

export type ConfigurationsDegreesType = {
  codigo?: number;
  label: string;
  color: string;
  weight: number;
  description: string;
};
export type ConfigurationsOpportunitiesType = {
  codigo?: number;
  decision: string;
  description: string;
};

interface ConfigurationsDegreesProps {
  title: string;
  configValues: ConfigurationsDegreesType[] | ConfigurationsOpportunitiesType[];
  // setDegreeValues?: React.Dispatch<React.SetStateAction<Degrees>>;
  isDegree?: boolean;
}

const InputPropsTextFild = { readOnly: true };

const ConfigurationsDegrees = ({ title, configValues, isDegree }: ConfigurationsDegreesProps) => {
  const [probability, setProbability] = useState<string>('');

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'grid', rowGap: 2 }}>
      <Typography variant="h5">{isDegree ? `Graus de ${title}` : `Classificação das ${title}`}</Typography>
      <Divider variant="fullWidth" sx={{ bgcolor: 'black', height: 1, marginX: -2 }} />
      {configValues.map(degreeItem => (
        <Stack direction="row" spacing={2}>
          {isDegree ? (
            <>
              <InputDegreeColor label="Grau" color={degreeItem.color} value={degreeItem.label} InputProps={InputPropsTextFild} />
              <TextField label="Peso" placeholder="Peso" value={degreeItem.weight} InputProps={InputPropsTextFild} />
            </>
          ) : (
            <>
              <TextField label="Código" placeholder="Código" value={degreeItem.codigo} InputProps={InputPropsTextFild} />
              <TextField label="Decisão" placeholder="Decisão" value={degreeItem.decision} InputProps={InputPropsTextFild} />
            </>
          )}
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
