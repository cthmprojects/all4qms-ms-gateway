import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import IndicatorValues from './indicator-values';

type IndicatorGoalsProps = {
  frequencies: Array<string>;
  unit: string;
  onChanged: (frequencies: Array<string>, goals: Array<Array<number | null>>, years: Array<number>) => void;
};

const IndicatorGoals = ({ frequencies, onChanged, unit }: IndicatorGoalsProps) => {
  const [goalFrequencies, setGoalFrequencies] = useState<Array<string>>([]);
  const [goals, setGoals] = useState<Array<Array<number | null>>>([
    [...[null, null, null, null, null, null, null, null, null, null, null, null]],
  ]);
  const [goalYears, setGoalYears] = useState<Array<number>>([]);

  useEffect(() => {
    onChanged(goalFrequencies, goals, goalYears);
  }, [goalFrequencies, goals, goalYears]);

  const addGoal = (): void => {
    const values: Array<number | null> = [null, null, null, null, null, null, null, null, null, null, null, null];
    setGoals([...goals, values]);
  };

  const onIndicatorValuesChanged = (frequency: string, year: number, values: Array<number | null>, idx: number): void => {
    updateFrequency(frequency, idx);
    updateGoal(values, idx);
    updateYear(year, idx);
  };

  const removeGoal = (idx: number): void => {
    const newGoals: Array<Array<number | null>> = [...goals.filter((_, i) => i !== idx)];
    setGoals(newGoals);
  };

  const updateFrequency = (frequency: string, idx: number): void => {
    const allFrequencies: Array<string> = [...goalFrequencies];
    allFrequencies[idx] = frequency;
    setGoalFrequencies(allFrequencies);
  };

  const updateGoal = (values: Array<number | null>, idx: number): void => {
    const allGoals: Array<Array<number | null>> = [...goals];
    allGoals[idx] = values;
    setGoals(allGoals);
  };

  const updateYear = (year: number, idx: number): void => {
    const allYears: Array<number> = [...goalYears];
    allYears[idx] = year;
    setGoalYears(allYears);
  };

  return (
    <Stack spacing={2}>
      {goals.map((goal, idx) => (
        <IndicatorValues
          allowAdding={idx === 0}
          allowRemoving={idx !== 0}
          frequencies={frequencies}
          initialValues={[...goal]}
          onAdded={addGoal}
          onRemoved={() => removeGoal(idx)}
          onChanged={(frequency, year, values) => onIndicatorValuesChanged(frequency, year, values, idx)}
          unit={unit}
        />
      ))}
    </Stack>
  );
};

export default IndicatorGoals;
