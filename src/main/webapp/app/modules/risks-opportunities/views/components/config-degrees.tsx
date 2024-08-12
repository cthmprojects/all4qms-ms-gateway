import { Divider, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfigDegree from './config-degree';

export type ConfigurationsDegreesType = {
  codigo?: number;
  label: string;
  color: string;
  weight: number;
  description: string;
};
export type ConfigurationsClassificationType = {
  codigo?: number;
  decision: string;
  description: string;
};

interface ConfigurationsDegreesProps {
  title: string;
  configValues: ConfigurationsDegreesType[] | ConfigurationsClassificationType[];
  // setDegreeValues?: React.Dispatch<React.SetStateAction<Degrees>>;
  isDegree?: boolean;
  onChanged: (descriptions: Array<string>) => void;
}

const ConfigurationsDegrees = ({ title, configValues, isDegree, onChanged }: ConfigurationsDegreesProps) => {
  const [descriptions, setDescriptions] = useState<Array<string>>([]);

  useEffect(() => {
    if (!configValues || configValues.length === 0) {
      return;
    }

    const allDescriptions: Array<string> = [];

    for (let i = 0; i < configValues.length; i++) {
      const configValue = configValues[i];
      allDescriptions.push(configValue.description);
    }

    setDescriptions(allDescriptions);
  }, [configValues]);

  useEffect(() => {
    onChanged(descriptions);
  }, [descriptions]);

  const updateDescription = (description: string, idx: number): void => {
    if (idx < 0 || idx >= descriptions.length) {
      return;
    }

    const allDescriptions: Array<string> = [...descriptions];
    allDescriptions[idx] = description;
    setDescriptions(allDescriptions);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'grid', rowGap: 2 }}>
      <Typography variant="h5">{`Graus de ${title}`}</Typography>
      <Divider variant="fullWidth" sx={{ bgcolor: 'black', height: 1, marginX: -2 }} />
      {configValues.map((degreeItem, idx) => (
        <ConfigDegree
          description={degreeItem.description}
          title={title}
          code={degreeItem.codigo}
          color={degreeItem.color}
          decision={degreeItem.decision}
          key={`config-degree-${idx}`}
          label={degreeItem.label}
          weight={degreeItem.weight}
          onChanged={description => updateDescription(description, idx)}
        />
      ))}
    </Paper>
  );
};

export default ConfigurationsDegrees;
