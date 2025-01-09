import { Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Analysis } from '../../models';
import IndicatorMeasurementAnalysis from './indicator-measurement-analysis';
import IndicatorValues from './indicator-values';

type IndicatorMeasurementsProps = {
  canAddAnalysis?: boolean;
  frequencies: Array<string>;
  initialAnalysis: Array<Analysis>;
  initialFrequency?: string;
  initialValues?: Array<Array<number | null>>;
  unit: string;
  indicatorYear: string;
  onChanged: (measurements: Array<Array<number | null>>, allAnalysis: Array<Analysis | null>) => void;
};

const IndicatorMeasurements = ({
  canAddAnalysis,
  frequencies,
  initialAnalysis,
  initialFrequency,
  initialValues,
  indicatorYear,
  unit,
  onChanged,
}: IndicatorMeasurementsProps) => {
  const [allAnalysis, setAllAnalysis] = useState<Array<Analysis | null>>([]);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Array<Array<number | null>>>([
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    onChanged(measurements, allAnalysis);
  }, [allAnalysis, measurements]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setMeasurements(initialValues);
  }, [initialValues]);

  const onIndicatorValuesChanged = (frequency: string, year: number, values: Array<number | null>, idx: number): void => {
    setYear(year);
    setFrequency(frequency);
    updateMeasurements(values, idx);
  };

  const updateMeasurements = (values: Array<number | null>, idx: number): void => {
    const allMeasurements: Array<Array<number | null>> = [...measurements];
    allMeasurements[idx] = values;
    setMeasurements(allMeasurements);
  };

  const analysisIndices = useMemo<Array<number>>(() => {
    const indices: Array<number> = [];

    if (initialFrequency === 'MENSAL') {
      indices.push(0);
      indices.push(1);
      indices.push(2);
      indices.push(3);
      indices.push(4);
      indices.push(5);
      indices.push(6);
      indices.push(7);
      indices.push(8);
      indices.push(9);
      indices.push(10);
      indices.push(11);
    } else if (initialFrequency === 'BIMESTRAL') {
      indices.push(0);
      indices.push(2);
      indices.push(4);
      indices.push(6);
      indices.push(8);
      indices.push(10);
    } else if (initialFrequency === 'TRIMESTRAL') {
      indices.push(0);
      indices.push(3);
      indices.push(6);
      indices.push(9);
    } else if (initialFrequency === 'QUADRIMESTRAL') {
      indices.push(0);
      indices.push(4);
      indices.push(8);
    } else if (initialFrequency === 'SEMESTRAL') {
      indices.push(0);
      indices.push(6);
    } else if (initialFrequency === 'ANUAL') {
      indices.push(0);
    }

    return indices;
  }, [initialFrequency]);

  const analysisLabels = useMemo<Array<string>>(() => {
    const labels: Array<string> = [];

    if (initialFrequency === 'MENSAL') {
      labels.push('JAN');
      labels.push('FEV');
      labels.push('MAR');
      labels.push('ABR');
      labels.push('MAI');
      labels.push('JUN');
      labels.push('JUL');
      labels.push('AGO');
      labels.push('SET');
      labels.push('OUT');
      labels.push('NOV');
      labels.push('DEZ');
    } else if (initialFrequency === 'BIMESTRAL') {
      labels.push('1º B');
      labels.push('2º B');
      labels.push('3º B');
      labels.push('4º B');
      labels.push('5º B');
      labels.push('6º B');
    } else if (initialFrequency === 'TRIMESTRAL') {
      labels.push('1º T');
      labels.push('2º T');
      labels.push('3º T');
      labels.push('4º T');
    } else if (initialFrequency === 'QUADRIMESTRAL') {
      labels.push('1º Q');
      labels.push('2º Q');
      labels.push('3º Q');
    } else if (initialFrequency === 'SEMESTRAL') {
      labels.push('1º S');
      labels.push('2º S');
    } else if (initialFrequency === 'ANUAL') {
      labels.push('Ano');
    }

    return labels;
  }, [initialFrequency]);

  useEffect(() => {
    if (!analysisIndices || !analysisLabels || analysisIndices.length !== analysisLabels.length) {
      return;
    }

    const arr: Array<Analysis> = [];
    for (let i = 0; i < analysisIndices.length; i++) {
      const analysis: Analysis | null = initialAnalysis && initialAnalysis.length > i ? initialAnalysis[i] : null;

      arr.push(analysis);
    }

    setAllAnalysis(arr);
  }, [analysisIndices, analysisLabels, initialAnalysis]);

  const updateAnalysis = (analysis: Analysis, idx: number) => {
    const updated: Array<Analysis> = [...allAnalysis];
    updated[idx] = analysis;
    setAllAnalysis(updated);
  };

  return (
    <Stack spacing={2}>
      {measurements.map((measurement, idx) => (
        <>
          <IndicatorValues
            allowAdding={false}
            frequencies={frequencies}
            initialFrequency={initialFrequency}
            initialValues={[...measurement]}
            initialYear={indicatorYear}
            inputOnly
            onChanged={(frequency, year, values) => onIndicatorValuesChanged(frequency, year, values, idx)}
            unit={unit}
          />

          {canAddAnalysis &&
            allAnalysis.map((analysis, idx) => (
              <IndicatorMeasurementAnalysis
                action={analysis?.action ?? ''}
                analysisDetails={analysis?.analysisDetails ?? ''}
                deadline={analysis?.deadline ?? ''}
                description={analysis?.description ?? ''}
                key={`analysis-${idx}`}
                label={analysisLabels[idx]}
                onActionChanged={action =>
                  updateAnalysis(
                    {
                      action: action ?? '',
                      analysisDetails: analysis?.analysisDetails ?? '',
                      deadline: analysis?.deadline ?? '',
                      description: analysis?.description ?? '',
                      responsible: analysis?.responsible ?? '',
                      month: idx,
                      indicatorGoal: null,
                      indicatorGoalId: -1,
                    },
                    idx
                  )
                }
                onAnalysisDetailsChanged={analysisDetails =>
                  updateAnalysis(
                    {
                      action: analysis?.action ?? '',
                      analysisDetails: analysisDetails ?? '',
                      deadline: analysis?.deadline ?? '',
                      description: analysis?.description ?? '',
                      responsible: analysis?.responsible ?? '',
                      month: idx,
                      indicatorGoal: null,
                      indicatorGoalId: -1,
                    },
                    idx
                  )
                }
                onDeadlineChanged={deadline =>
                  updateAnalysis(
                    {
                      action: analysis?.action ?? '',
                      analysisDetails: analysis?.analysisDetails ?? '',
                      deadline: deadline ?? '',
                      description: analysis?.description ?? '',
                      responsible: analysis?.responsible ?? '',
                      month: idx,
                      indicatorGoal: null,
                      indicatorGoalId: -1,
                    },
                    idx
                  )
                }
                onDescriptionChanged={description =>
                  updateAnalysis(
                    {
                      action: analysis?.action ?? '',
                      analysisDetails: analysis?.analysisDetails ?? '',
                      deadline: analysis?.deadline ?? '',
                      description: description,
                      responsible: analysis?.responsible ?? '',
                      month: idx,
                      indicatorGoal: null,
                      indicatorGoalId: -1,
                    },
                    idx
                  )
                }
                onResponsibleChanged={responsible =>
                  updateAnalysis(
                    {
                      action: analysis?.action ?? '',
                      analysisDetails: analysis?.analysisDetails ?? '',
                      deadline: analysis?.deadline ?? '',
                      description: analysis?.description,
                      responsible: responsible ?? '',
                      month: idx,
                      indicatorGoal: null,
                      indicatorGoalId: -1,
                    },
                    idx
                  )
                }
                responsible={analysis?.responsible ?? ''}
              />
            ))}
        </>
      ))}
    </Stack>
  );
};

export default IndicatorMeasurements;
