import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import IndicatorValues from './indicator-values';

type IndicatorMeasurementsProps = {
  frequencies: Array<string>;
  initialValues?: Array<Array<number | null>>;
  unit: string;
};

const IndicatorMeasurements = ({ frequencies, initialValues, unit }: IndicatorMeasurementsProps) => {
  const [measurements, setMeasurements] = useState<Array<Array<number | null>>>([]);

  useEffect(() => {
    const values: Array<number | null> = [null, null, null, null, null, null, null, null, null, null, null, null];
    setMeasurements([[...values]]);
  }, []);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setMeasurements(initialValues);
  }, [initialValues]);

  const addGoal = (): void => {
    const values: Array<number | null> = [null, null, null, null, null, null, null, null, null, null, null, null];
    setMeasurements([...measurements, values]);
  };

  const updateGoal = (values: Array<number | null>, idx: number): void => {
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
          initialValues={measurement}
          inputOnly
          onAdded={addGoal}
          onChanged={values => updateGoal(values, idx)}
          unit={unit}
        />
      ))}
    </Stack>
  );
};

export default IndicatorMeasurements;
