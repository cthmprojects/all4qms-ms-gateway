import { Box, Button, Stack } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import { useEffect, useState } from 'react';
import { Configuration, Option, RawMap } from '../../models';
import { saveConfiguration, updateConfiguration } from '../../reducers/configurations.reducer';
import ConfigComplexityMatrix from './config-complexity-matrix';
import ConfigurationsDegrees, { ConfigurationsClassificationType, ConfigurationsDegreesType } from './config-degrees';
import { saveMap, updateMap } from '../../reducers/maps.reducer';
import { useNavigate } from 'react-router-dom';

type ConfigurationsType = {
  complexityDegrees: ConfigurationsDegreesType[];
  improvimentDegrees: ConfigurationsDegreesType[];
  opportunitiesClassification: ConfigurationsClassificationType[];
};

type ConfigurationTabOpportunityProps = {
  configurations: Array<Configuration>;
  levels: Array<Option>;
  map: RawMap | null;
  onSaved: () => void;
};

const ConfigurationsTabOpportunity = ({ configurations, levels, map, onSaved }: ConfigurationTabOpportunityProps) => {
  const dispatch = useAppDispatch();

  const [complexities, setComplexities] = useState<Array<ConfigurationsDegreesType>>([]);
  const [improvements, setImprovements] = useState<Array<ConfigurationsDegreesType>>([]);
  const [opportunities, setOpportunities] = useState<Array<ConfigurationsClassificationType>>([]);

  const [newComplexities, setNewComplexities] = useState<Array<ConfigurationsDegreesType>>([]);
  const [newImprovements, setNewImprovements] = useState<Array<ConfigurationsDegreesType>>([]);
  const [newOpportunities, setNewOpportunities] = useState<Array<ConfigurationsClassificationType>>([]);

  const [newMap, setNewMap] = useState<RawMap | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!levels || levels.length <= 0) {
      return;
    }

    const allComplexities: Array<ConfigurationsDegreesType> = [];
    const allImprovements: Array<ConfigurationsDegreesType> = [];

    for (let i = 0; i < levels.length; i++) {
      const level: Option = levels[i];

      const { code, name, value } = level;

      allComplexities.push({
        color: getColor(value),
        description: getDescription('C', name),
        label: value,
        weight: getWeight(value),
      });

      allImprovements.push({
        color: getColor(value),
        description: getDescription('M', name),
        label: value,
        weight: getWeight(value),
      });
    }
    setComplexities(allComplexities);
    setImprovements(allImprovements);

    const allOpportunities: Array<ConfigurationsClassificationType> = [
      {
        codigo: 1,
        decision: getDecision('B', 'Não implementar'),
        description: getDescription('D', 'B'),
      },
      {
        codigo: 2,
        decision: getDecision('M', 'Avaliar'),
        description: getDescription('D', 'M'),
      },
      {
        codigo: 3,
        decision: getDecision('A', 'Implementar'),
        description: getDescription('D', 'A'),
      },
    ];
    setOpportunities(allOpportunities);
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

  const onComplexityDescriptionsChanged = (descriptions: Array<string>): void => {
    const allComplexities: Array<ConfigurationsDegreesType> = [...complexities];

    for (let i = 0; i < allComplexities.length; i++) {
      const complexity: ConfigurationsDegreesType = allComplexities[i];
      const description: string = descriptions[i];
      complexity.description = description;
    }

    setNewComplexities(allComplexities);
  };

  const onImprovementDescriptionsChanged = (descriptions: Array<string>): void => {
    const allImprovements: Array<ConfigurationsDegreesType> = [...improvements];

    for (let i = 0; i < allImprovements.length; i++) {
      const improvements: ConfigurationsDegreesType = allImprovements[i];
      const description: string = descriptions[i];
      improvements.description = description;
    }

    setNewImprovements(allImprovements);
  };

  const onOpportunityDescriptionsChanged = (descriptions: Array<string>): void => {
    const allOpportunities: Array<ConfigurationsClassificationType> = [...opportunities];

    for (let i = 0; i < allOpportunities.length; i++) {
      const opportunity: ConfigurationsClassificationType = allOpportunities[i];
      const description: string = descriptions[i];
      opportunity.description = description;
    }

    setNewOpportunities(allOpportunities);
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
    // Save opportunities
    for (let i = 0; i < newOpportunities.length; i++) {
      const opportunity: ConfigurationsClassificationType = newOpportunities[i];
      const existingConfiguration: Configuration | null = findExistingConfiguration(getLevelByCode(opportunity.codigo), 'D');
      const now: Date = new Date();

      if (!existingConfiguration) {
        dispatch(
          saveConfiguration({
            atualizadoEm: now,
            atualizadoPor: 1, // TODO: Get proper user ID
            criadoEm: now,
            criadoPor: 1, // TODO: Get proper user ID
            decisaoRO: opportunity.decision,
            descricaoRO: opportunity.description,
            grauRO: getLevelByCode(opportunity.codigo),
            pesoRO: opportunity.codigo,
            tipoAnaliseRO: 'D',
            tipoRO: 'O',
          })
        );
      } else {
        dispatch(
          updateConfiguration({
            atualizadoEm: now,
            atualizadoPor: 1, // TODO: Get proper user ID
            criadoEm: now,
            criadoPor: 1, // TODO: Get proper user ID
            decisaoRO: opportunity.decision,
            descricaoRO: opportunity.description,
            grauRO: getLevelByCode(opportunity.codigo),
            pesoRO: opportunity.codigo,
            tipoAnaliseRO: 'D',
            tipoRO: 'O',
            id: existingConfiguration.id,
          })
        );
      }
    }

    // Save complexities
    for (let i = 0; i < newComplexities.length; i++) {
      const complexity: ConfigurationsDegreesType = newComplexities[i];
      const level: 'B' | 'M' | 'A' = getCode(complexity.label) as 'B' | 'M' | 'A';
      const existingConfiguration: Configuration | null = findExistingConfiguration(level, 'C');
      const now: Date = new Date();

      if (!existingConfiguration) {
        dispatch(
          saveConfiguration({
            atualizadoEm: now,
            atualizadoPor: 1, // TODO: Get proper user ID
            criadoEm: now,
            criadoPor: 1, // TODO: Get proper user ID
            decisaoRO: '',
            descricaoRO: complexity.description,
            grauRO: level,
            pesoRO: complexity.weight,
            tipoAnaliseRO: 'C',
            tipoRO: 'O',
          })
        );
      } else {
        dispatch(
          updateConfiguration({
            atualizadoEm: now,
            atualizadoPor: 1, // TODO: Get proper user ID
            criadoEm: now,
            criadoPor: 1, // TODO: Get proper user ID
            decisaoRO: '',
            descricaoRO: complexity.description,
            grauRO: level,
            pesoRO: complexity.weight,
            tipoAnaliseRO: 'C',
            tipoRO: 'O',
            id: existingConfiguration.id,
          })
        );
      }
    }

    // Save improvements
    for (let i = 0; i < newImprovements.length; i++) {
      const improvement: ConfigurationsDegreesType = newImprovements[i];
      const level: 'B' | 'M' | 'A' = getCode(improvement.label) as 'B' | 'M' | 'A';
      const existingConfiguration: Configuration | null = findExistingConfiguration(level, 'M');
      const now: Date = new Date();

      if (!existingConfiguration) {
        dispatch(
          saveConfiguration({
            atualizadoEm: now,
            atualizadoPor: 1, // TODO: Get proper user ID
            criadoEm: now,
            criadoPor: 1, // TODO: Get proper user ID
            decisaoRO: '',
            descricaoRO: improvement.description,
            grauRO: level,
            pesoRO: improvement.weight,
            tipoAnaliseRO: 'M',
            tipoRO: 'O',
          })
        );
      } else {
        dispatch(
          updateConfiguration({
            atualizadoEm: now,
            atualizadoPor: 1, // TODO: Get proper user ID
            criadoEm: now,
            criadoPor: 1, // TODO: Get proper user ID
            decisaoRO: '',
            descricaoRO: improvement.description,
            grauRO: level,
            pesoRO: improvement.weight,
            tipoAnaliseRO: 'M',
            tipoRO: 'O',
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
          atualizadoPor: 1, // TODO: Get proper user ID
          criadoEm: now,
          criadoPor: 1, // TODO: Get proper user ID
          decisaoEixo11: newMap.decisaoEixo11 ?? { id: defaultConfiguration.id },
          decisaoEixo12: newMap.decisaoEixo12 ?? { id: defaultConfiguration.id },
          decisaoEixo13: newMap.decisaoEixo13 ?? { id: defaultConfiguration.id },
          decisaoEixo21: newMap.decisaoEixo21 ?? { id: defaultConfiguration.id },
          decisaoEixo22: newMap.decisaoEixo22 ?? { id: defaultConfiguration.id },
          decisaoEixo23: newMap.decisaoEixo23 ?? { id: defaultConfiguration.id },
          decisaoEixo31: newMap.decisaoEixo31 ?? { id: defaultConfiguration.id },
          decisaoEixo32: newMap.decisaoEixo32 ?? { id: defaultConfiguration.id },
          decisaoEixo33: newMap.decisaoEixo33 ?? { id: defaultConfiguration.id },
          tipoRO: 'O',
        })
      );
    } else {
      dispatch(
        updateMap({
          atualizadoEm: now,
          atualizadoPor: 1, // TODO: Get proper user ID
          criadoEm: now,
          criadoPor: 1, // TODO: Get proper user ID
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
          tipoRO: 'O',
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
      <ConfigurationsDegrees isDegree title="Complexidade" configValues={complexities} onChanged={onComplexityDescriptionsChanged} />
      <ConfigurationsDegrees isDegree title="Melhoria" configValues={improvements} onChanged={onImprovementDescriptionsChanged} />
      <ConfigurationsDegrees title="Oportunidades" configValues={opportunities} onChanged={onOpportunityDescriptionsChanged} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {opportunities.length > 0 && <ConfigComplexityMatrix classifications={opportunities} map={newMap} onChanged={onMatrixChanged} />}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2, pt: 5, pr: 6 }}>
        <Button variant="contained" size="large" sx={{ bgcolor: '#E0E0E0', color: 'black' }} onClick={() => navigate(-1)}>
          VOLTAR
        </Button>
        <Button onClick={onSaveClicked} variant="contained" size="large" sx={{ bgcolor: '#EBC139', color: 'black' }}>
          SALVAR
        </Button>
      </Box>
    </Stack>
  );
};

export default ConfigurationsTabOpportunity;
