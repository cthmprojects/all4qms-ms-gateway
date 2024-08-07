import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { InputAdornment } from '@mui/material';

interface DegreeProps {
  label: string;
  color: string;
  value: string;
  InputProps?: {};
}
const DegreeBulletColor: React.FC<any> = ({ color }) => {
  return <Box width={20} height={20} borderRadius="50%" bgcolor={color} />;
};

const InputDegreeColor: React.FC<DegreeProps> = ({ label, color, value, InputProps }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      sx={{ width: '140px' }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <DegreeBulletColor color={color} />
          </InputAdornment>
        ),
      }}
    />
  );
};
export default InputDegreeColor;
