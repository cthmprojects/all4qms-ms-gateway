import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

type IndicatorValueProps = {
  label: string;
  readonly?: boolean;
  value: string;
  onChanged: (value: string) => void;
};

const IndicatorValue = ({ label, readonly, value, onChanged }: IndicatorValueProps) => {
  return (
    <TextField
      disabled={readonly}
      label={label}
      onChange={event => onChanged(event.target.value)}
      placeholder={label}
      type="number"
      value={value}
    />
  );
};

export default IndicatorValue;
