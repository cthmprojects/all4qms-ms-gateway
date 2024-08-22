import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

type IndicatorValueProps = {
  label: string;
  value: string;
  onChanged: (value: string) => void;
};

const IndicatorValue = ({ label, value, onChanged }: IndicatorValueProps) => {
  return <TextField label={label} onChange={event => onChanged(event.target.value)} placeholder={label} type="number" value={value} />;
};

export default IndicatorValue;
