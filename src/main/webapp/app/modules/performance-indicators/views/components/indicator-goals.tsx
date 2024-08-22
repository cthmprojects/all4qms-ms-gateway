import { useEffect, useState } from 'react';
import IndicatorValues from './indicator-values';
import { Button, IconButton, Stack } from '@mui/material';

type IndicatorGoalsProps = {
  frequencies: Array<string>;
  unit: string;
};

const IndicatorGoals = ({ frequencies, unit }: IndicatorGoalsProps) => {
  const [goals, setGoals] = useState<Array<Array<number | null>>>([]);

  useEffect(() => {
    const values: Array<number | null> = [null, null, null, null, null, null, null, null, null, null, null, null];
    setGoals([[...values]]);
  }, []);

  const addGoal = (): void => {
    const values: Array<number | null> = [null, null, null, null, null, null, null, null, null, null, null, null];
    setGoals([...goals, values]);
  };

  const updateGoal = (values: Array<number | null>, idx: number): void => {
    const allGoals: Array<Array<number | null>> = [...goals];
    allGoals[idx] = values;
    setGoals(allGoals);
  };

  return (
    <Stack spacing={2}>
      {goals.map((goal, idx) => (
        <IndicatorValues
          allowAdding={idx === 0}
          frequencies={frequencies}
          onAdded={addGoal}
          onChanged={values => updateGoal(values, idx)}
          unit={unit}
        />
      ))}
    </Stack>
  );
};

export default IndicatorGoals;
