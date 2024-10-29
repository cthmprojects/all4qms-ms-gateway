import { Box, Button, Stack } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Configuration, Option, RawMap } from '../../models';
import { saveConfiguration, updateConfiguration } from '../../reducers/configurations.reducer';
import { saveMap, updateMap } from '../../reducers/maps.reducer';
import ConfigComplexityMatrix from './config-complexity-matrix';
import ConfigurationsDegrees, { ConfigurationsClassificationType, ConfigurationsDegreesType } from './config-degrees';

type ConfigurationTabRiskProps = {
  configurations: Array<Configuration>;
  levels: Array<Option>;
  loading: boolean;
  map: RawMap | null;
  onSaved: () => void;
  userId: number | null;
};

const ConfigurationsTabRisk = ({ configurations, levels, loading, map, onSaved, userId }: ConfigurationTabRiskProps) => {
  const dispatch = useAppDispatch();

  const [classifications, setClassifications] = useState<Array<ConfigurationsClassificationType>>([]);
  const [probabilities, setProbabilities] = useState<Array<ConfigurationsDegreesType>>([]);
  const [severities, setSeverities] = useState<Array<ConfigurationsDegreesType>>([]);

  const [newClassifications, setNewClassifications] = useState<Array<ConfigurationsClassificationType>>([]);
  const [newProbabilities, setNewProbabilities] = useState<Array<ConfigurationsDegreesType>>([]);
  const [newSeverities, setNewSeverities] = useState<Array<ConfigurationsDegreesType>>([]);

  const [newMap, setNewMap] = useState<RawMap | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!levels || levels.length <= 0) {
      return;
    }

    const allProbabilities: Array<ConfigurationsDegreesType> = [];
    const allSeverities: Array<ConfigurationsDegreesType> = [];

    for (let i = 0; i < levels.length; i++) {
      const level: Option = levels[i];

      const { code, name, value } = level;

      allProbabilities.push({
        color: getColor(value),
        description: getDescription('P', name),
        label: value,
        weight: getWeight(value),
      });

      allSeverities.push({
        color: getColor(value),
        description: getDescription('S', name),
        label: value,
        weight: getWeight(value),
      });
    }
    setProbabilities(allProbabilities);
    setSeverities(allSeverities);

    const allClassifications: Array<ConfigurationsClassificationType> = [
      {
        codigo: 1,
        decision: getDecision('B', 'Aceitar o risco'),
        description: getDescription('D', 'B'),
      },
      {
        codigo: 2,
        decision: getDecision('M', 'Avaliar o risco'),
        description: getDescription('D', 'M'),
      },
      {
        codigo: 3,
        decision: getDecision('A', 'Reduzir o risco'),
        description: getDescription('D', 'A'),
      },
    ];
    setClassifications(allClassifications);
  }, [configurations, levels]);

  useEffect(() => {
    if (!map) {
      return;
    }

    setNewMap({ ...map });
  }, [map]);

  const getWeight = (level: string): number => {
    if (level.toUpperCase() === 'ALTO') {
      return 3;
    } else if (level.toUpperCase() === 'MEDIO') {
      return 2;
    } else {
      return 1;
    }
  };

  const getCode = (level: string): string => {
    const filteredLevels: Array<Option> = levels.filter(l => l.value === level);

    return filteredLevels.length > 0 ? filteredLevels[0].name : '';
  };

  const getColor = (level: string): string => {
    if (level.toUpperCase() === 'ALTO') {
      return 'lightsalmon';
    } else if (level.toUpperCase() === 'MEDIO') {
      return 'lightgoldenrodyellow';
    } else {
      return 'lightgreen';
    }
  };

  const getDescription = (type: string, name: string): string => {
    const filteredConfigurations: Array<Configuration> = configurations.filter(c => c.grauRO === name && c.tipoAnaliseRO === type);

    return filteredConfigurations.length > 0 ? filteredConfigurations[0].descricaoRO : '';
  };

  const getDecision = (name: string, defaultValue: string = ''): string => {
    const filteredConfigurations: Array<Configuration> = configurations.filter(c => c.grauRO === name && c.tipoAnaliseRO === 'D');

    return filteredConfigurations.length > 0 ? filteredConfigurations[0].decisaoRO : defaultValue;
  };

  const onProbabilityDescriptionsChanged = (descriptions: Array<string>): void => {
    const allProbabilities: Array<ConfigurationsDegreesType> = [...probabilities];

    for (let i = 0; i < allProbabilities.length; i++) {
      const probability: ConfigurationsDegreesType = allProbabilities[i];
      const description: string = descriptions[i];
      probability.description = description;
    }

    setNewProbabilities(allProbabilities);
  };

  const onSeverityDescriptionsChanged = (descriptions: Array<string>): void => {
    const allSeverities: Array<ConfigurationsDegreesType> = [...severities];

    for (let i = 0; i < allSeverities.length; i++) {
      const severity: ConfigurationsDegreesType = allSeverities[i];
      const description: string = descriptions[i];
      severity.description = description;
    }

    setNewSeverities(allSeverities);
  };

  const onRiskDescriptionsChanged = (descriptions: Array<string>): void => {
    const allClassifications: Array<ConfigurationsClassificationType> = [...classifications];

    for (let i = 0; i < allClassifications.length; i++) {
      const classification: ConfigurationsClassificationType = allClassifications[i];
      const description: string = descriptions[i];
      classification.description = description;
    }

    setNewClassifications(allClassifications);
  };

  const findExistingConfiguration = (level: string, type: string): Configuration | null => {
    const filteredConfigurations: Array<Configuration> = configurations.filter(c => c.grauRO === level && c.tipoAnaliseRO === type);

    return filteredConfigurations.length > 0 ? filteredConfigurations[0] : null;
  };

  const getLevelByCode = (code: number): 'B' | 'M' | 'A' => {
    if (code === 1) {
      return 'B';
    } else if (code === 2) {
      return 'M';
    } else {
      return 'A';
    }
  };

  const getConfigurationByCode = (code: number): Configuration | null => {
    const filteredConfigurations: Array<Configuration> = configurations.filter(c => c.pesoRO === code && c.tipoAnaliseRO === 'D');

    return filteredConfigurations.length > 0 ? filteredConfigurations[0] : null;
  };

  const onSaveClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    // Save classifications
    for (let i = 0; i < newClassifications.length; i++) {
      const classification: ConfigurationsClassificationType = newClassifications[i];
      const existingConfiguration: Configuration | null = findExistingConfiguration(getLevelByCode(classification.codigo), 'D');
      const now: Date = new Date();

      if (!existingConfiguration) {
        dispatch(
          saveConfiguration({
            atualizadoEm: now,
            atualizadoPor: userId,
            criadoEm: now,
            criadoPor: userId,
            decisaoRO: classification.decision,
            descricaoRO: classification.description,
            grauRO: getLevelByCode(classification.codigo),
            pesoRO: classification.codigo,
            tipoAnaliseRO: 'D',
            tipoRO: 'R',
          })
        );
      } else {
        dispatch(
          updateConfiguration({
            atualizadoEm: now,
            atualizadoPor: userId,
            criadoEm: now,
            criadoPor: userId,
            decisaoRO: classification.decision,
            descricaoRO: classification.description,
            grauRO: getLevelByCode(classification.codigo),
            pesoRO: classification.codigo,
            tipoAnaliseRO: 'D',
            tipoRO: 'R',
            id: existingConfiguration.id,
          })
        );
      }
    }

    // Save probabilities
    for (let i = 0; i < newProbabilities.length; i++) {
      const probability: ConfigurationsDegreesType = newProbabilities[i];
      const level: 'B' | 'M' | 'A' = getCode(probability.label) as 'B' | 'M' | 'A';
      const existingConfiguration: Configuration | null = findExistingConfiguration(level, 'P');
      const now: Date = new Date();

      if (!existingConfiguration) {
        dispatch(
          saveConfiguration({
            atualizadoEm: now,
            atualizadoPor: userId,
            criadoEm: now,
            criadoPor: userId,
            decisaoRO: '',
            descricaoRO: probability.description,
            grauRO: level,
            pesoRO: probability.weight,
            tipoAnaliseRO: 'P',
            tipoRO: 'R',
          })
        );
      } else {
        dispatch(
          updateConfiguration({
            atualizadoEm: now,
            atualizadoPor: userId,
            criadoEm: now,
            criadoPor: userId,
            decisaoRO: '',
            descricaoRO: probability.description,
            grauRO: level,
            pesoRO: probability.weight,
            tipoAnaliseRO: 'P',
            tipoRO: 'R',
            id: existingConfiguration.id,
          })
        );
      }
    }

    // Save severities
    for (let i = 0; i < newSeverities.length; i++) {
      const severity: ConfigurationsDegreesType = newSeverities[i];
      const level: 'B' | 'M' | 'A' = getCode(severity.label) as 'B' | 'M' | 'A';
      const existingConfiguration: Configuration | null = findExistingConfiguration(level, 'S');
      const now: Date = new Date();

      if (!existingConfiguration) {
        dispatch(
          saveConfiguration({
            atualizadoEm: now,
            atualizadoPor: userId,
            criadoEm: now,
            criadoPor: userId,
            decisaoRO: '',
            descricaoRO: severity.description,
            grauRO: level,
            pesoRO: severity.weight,
            tipoAnaliseRO: 'S',
            tipoRO: 'R',
          })
        );
      } else {
        dispatch(
          updateConfiguration({
            atualizadoEm: now,
            atualizadoPor: userId,
            criadoEm: now,
            criadoPor: userId,
            decisaoRO: '',
            descricaoRO: severity.description,
            grauRO: level,
            pesoRO: severity.weight,
            tipoAnaliseRO: 'S',
            tipoRO: 'R',
            id: existingConfiguration.id,
          })
        );
      }
    }

    // Save map
    const defaultConfiguration: Configuration | null = getConfigurationByCode(1);
    const now: Date = new Date();

    if (!map) {
      dispatch(
        saveMap({
          atualizadoEm: now,
          atualizadoPor: userId,
          criadoEm: now,
          criadoPor: userId,
          decisaoEixo11: newMap.decisaoEixo11 ?? { id: defaultConfiguration.id },
          decisaoEixo12: newMap.decisaoEixo12 ?? { id: defaultConfiguration.id },
          decisaoEixo13: newMap.decisaoEixo13 ?? { id: defaultConfiguration.id },
          decisaoEixo21: newMap.decisaoEixo21 ?? { id: defaultConfiguration.id },
          decisaoEixo22: newMap.decisaoEixo22 ?? { id: defaultConfiguration.id },
          decisaoEixo23: newMap.decisaoEixo23 ?? { id: defaultConfiguration.id },
          decisaoEixo31: newMap.decisaoEixo31 ?? { id: defaultConfiguration.id },
          decisaoEixo32: newMap.decisaoEixo32 ?? { id: defaultConfiguration.id },
          decisaoEixo33: newMap.decisaoEixo33 ?? { id: defaultConfiguration.id },
          tipoRO: 'R',
        })
      );
    } else {
      dispatch(
        updateMap({
          atualizadoEm: now,
          atualizadoPor: userId,
          criadoEm: now,
          criadoPor: userId,
          decisaoEixo11: newMap.decisaoEixo11 ?? { id: defaultConfiguration.id },
          decisaoEixo12: newMap.decisaoEixo12 ?? { id: defaultConfiguration.id },
          decisaoEixo13: newMap.decisaoEixo13 ?? { id: defaultConfiguration.id },
          decisaoEixo21: newMap.decisaoEixo21 ?? { id: defaultConfiguration.id },
          decisaoEixo22: newMap.decisaoEixo22 ?? { id: defaultConfiguration.id },
          decisaoEixo23: newMap.decisaoEixo23 ?? { id: defaultConfiguration.id },
          decisaoEixo31: newMap.decisaoEixo31 ?? { id: defaultConfiguration.id },
          decisaoEixo32: newMap.decisaoEixo32 ?? { id: defaultConfiguration.id },
          decisaoEixo33: newMap.decisaoEixo33 ?? { id: defaultConfiguration.id },
          id: map.id,
          tipoRO: 'R',
        })
      );
    }

    onSaved();
  };

  const onMatrixChanged = (value: number, row: number, column: number): void => {
    const configuration: Configuration | null = getConfigurationByCode(value);

    if (row === 1 && column === 1) {
      setNewMap({ ...newMap, decisaoEixo11: { id: configuration?.id, pesoRO: value } });
    } else if (row === 1 && column === 2) {
      setNewMap({ ...newMap, decisaoEixo12: { id: configuration?.id, pesoRO: value } });
    } else if (row === 1 && column === 3) {
      setNewMap({ ...newMap, decisaoEixo13: { id: configuration?.id, pesoRO: value } });
    } else if (row === 2 && column === 1) {
      setNewMap({ ...newMap, decisaoEixo21: { id: configuration?.id, pesoRO: value } });
    } else if (row === 2 && column === 2) {
      setNewMap({ ...newMap, decisaoEixo22: { id: configuration?.id, pesoRO: value } });
    } else if (row === 2 && column === 3) {
      setNewMap({ ...newMap, decisaoEixo23: { id: configuration?.id, pesoRO: value } });
    } else if (row === 3 && column === 1) {
      setNewMap({ ...newMap, decisaoEixo31: { id: configuration?.id, pesoRO: value } });
    } else if (row === 3 && column === 2) {
      setNewMap({ ...newMap, decisaoEixo32: { id: configuration?.id, pesoRO: value } });
    } else if (row === 3 && column === 3) {
      setNewMap({ ...newMap, decisaoEixo33: { id: configuration?.id, pesoRO: value } });
    }
  };

  return (
    <Stack spacing={2} pt={2}>
      <ConfigurationsDegrees isDegree title="Probabilidade" configValues={probabilities} onChanged={onProbabilityDescriptionsChanged} />
      <ConfigurationsDegrees isDegree title="Severidade" configValues={severities} onChanged={onSeverityDescriptionsChanged} />
      <ConfigurationsDegrees title="Riscos" configValues={classifications} onChanged={onRiskDescriptionsChanged} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {classifications.length > 0 && (
          <ConfigComplexityMatrix classifications={classifications} map={newMap} onChanged={onMatrixChanged} />
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2, pt: 5, pr: 6 }}>
        <Button variant="contained" size="large" sx={{ bgcolor: '#E0E0E0', color: 'black' }} onClick={() => navigate(-1)}>
          VOLTAR
        </Button>
        <Button disabled={loading} onClick={onSaveClicked} variant="contained" size="large" sx={{ bgcolor: '#EBC139', color: 'black' }}>
          SALVAR
        </Button>
      </Box>
    </Stack>
  );
};

export default ConfigurationsTabRisk;
