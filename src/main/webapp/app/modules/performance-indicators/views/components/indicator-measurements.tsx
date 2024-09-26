import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import IndicatorValues from './indicator-values';

type IndicatorMeasurementsProps = {
  frequencies: Array<string>;
  initialFrequency?: string;
  initialValues?: Array<Array<number | null>>;
  unit: string;
  onChanged: (measurements: Array<Array<number | null>>) => void;
};

const IndicatorMeasurements = ({ frequencies, initialFrequency, initialValues, unit, onChanged }: IndicatorMeasurementsProps) => {
  const [frequency, setFrequency] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Array<Array<number | null>>>([
    [null, , null, null, null, null, null, null, null, null, null, null, null],
  ]);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    onChanged(measurements);
  }, [measurements]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setMeasurements(initialValues);
  }, [initialValues]);

  const onIndicatorValuesChanged = (frequency: string, year: number, values: Array<number | null>, idx: number): void => {
    updateMeasurements(values, idx);
  };

  const updateMeasurements = (values: Array<number | null>, idx: number): void => {
    const allMeasurements: Array<Array<number | null>> = [...measurements];
    allMeasurements[idx] = values;
    setMeasurements(allMeasurements);
  };

  return (
    <Stack spacing={2}>
      {measurements.map((measurement, idx) => (
        <IndicatorValues
          allowAdding={false}
          frequencies={frequencies}
          initialFrequency={initialFrequency}
          initialValues={[...measurement]}
          inputOnly
          onChanged={(frequency, year, values) => onIndicatorValuesChanged(frequency, year, values, idx)}
          unit={unit}
        />
      ))}
    </Stack>
  );
};

export default IndicatorMeasurements;
