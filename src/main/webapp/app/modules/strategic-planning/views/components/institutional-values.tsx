import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import InstitutionalValue from './institutional-value';
import { useState } from 'react';

type InstitutionalValuesProps = {
  onChanged: (newValues: Array<string>) => void;
  values: Array<string>;
};

const InstitutionalValues = ({ onChanged, values }: InstitutionalValuesProps) => {
  const [value, setValue] = useState<string>('');

  const onValueAdded = (): void => {
    const newValues: Array<string> = [...values];
    newValues.push(value);
    onChanged(newValues);
    setValue('');
  };

  const onValueRemoved = (index: number): void => {
    const newValues: Array<string> = values.filter((_, idx) => idx !== index);
    onChanged(newValues);
  };

  return (
    <Card>
      <CardContent>
        <Typography sx={{ marginBottom: 2 }}>Valores</Typography>

        <InstitutionalValue onAdded={onValueAdded} onChanged={newValue => setValue(newValue)} value={value} />

        <Stack spacing={2} sx={{ marginTop: 2 }}>
          {values.map((value, index) => (
            <InstitutionalValue onRemoved={() => onValueRemoved(index)} readonly value={value} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InstitutionalValues;
