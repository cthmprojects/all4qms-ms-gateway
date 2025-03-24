import { Stack } from '@mui/material';
import { useState } from 'react';
import { Analysis } from '../../models';
import IndicatorMeasurementAnalysis from './indicator-measurement-analysis';
import IndicatorValues from './indicator-values';

type IndicatorMeasurementsProps = {
  canAddAnalysis?: boolean;
  frequencies: Array<string>;
  initialAnalysis: Array<Array<Analysis>>;
  initialFrequency?: string;
  initialValues?: Array<Array<number | null>>;
  labels: Array<string>;
  readonly?: boolean;
  unit: string;
  indicatorYear: string;
  users: Array<any>;
  onChanged: (measurements: Array<Array<number | null>>, allAnalysis: Array<Array<Analysis>>) => void;
};

const IndicatorMeasurements = ({
  canAddAnalysis,
  frequencies,
  initialAnalysis,
  initialFrequency,
  initialValues,
  indicatorYear,
  labels,
  readonly,
  unit,
  users,
  onChanged,
}: IndicatorMeasurementsProps) => {
  const [frequency, setFrequency] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const onIndicatorValuesChanged = (frequency: string, year: number, values: Array<number | null>, idx: number): void => {
    setYear(year);
    setFrequency(frequency);
    updateMeasurements(values, idx);
  };

  const updateMeasurements = (values: Array<number | null>, idx: number): void => {
    const allMeasurements: Array<Array<number | null>> = [...initialValues];
    allMeasurements[idx] = values;
    onChanged(allMeasurements, initialAnalysis);
  };

  const updateAnalysis = (analysis: Array<Analysis>, idx: number) => {
    const updated: Array<Array<Analysis>> = [...initialAnalysis];
    updated[idx] = analysis;
    onChanged(initialValues, updated);
  };

  return (
    <Stack spacing={2}>
      {initialValues.map((measurement, idx) => (
        <>
          <IndicatorValues
            allowAdding={false}
            frequencies={frequencies}
            initialFrequency={initialFrequency}
            initialValues={[...measurement]}
            initialYear={indicatorYear}
            inputOnly
            readonly={readonly}
            onChanged={(frequency, year, values) => onIndicatorValuesChanged(frequency, year, values, idx)}
            unit={unit}
          />

          {canAddAnalysis &&
            initialAnalysis.map((analysis, idx) => (
              <IndicatorMeasurementAnalysis
                allAnalysisInformation={analysis}
                key={`analysis-${idx}`}
                label={labels[idx]}
                onChanged={allAnalysisInformation => {
                  updateAnalysis(
                    allAnalysisInformation.map(analysisInformation => {
                      return {
                        action: analysisInformation?.action ?? '',
                        analysisDetails: analysisInformation?.analysisDetails ?? '',
                        deadline: analysisInformation?.deadline ?? '',
                        description: analysisInformation?.description ?? '',
                        responsible: analysisInformation?.responsible ?? -1,
                        month: idx,
                        indicatorGoal: null,
                        indicatorGoalId: -1,
                      };
                    }),
                    idx
                  );
                }}
                users={users}
              />
            ))}
        </>
      ))}
    </Stack>
  );
};

export default IndicatorMeasurements;
