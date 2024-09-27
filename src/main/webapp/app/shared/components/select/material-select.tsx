import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { forwardRef } from 'react';

export const MaterialSelect = forwardRef(
  (
    { fullWidth, children, className, variant, required, label, sx, error, helperText, ...rest }: SelectProps & { helperText?: string },
    ref
  ) => {
    return (
      <FormControl className={className} variant={variant} required={required} fullWidth={fullWidth} error={error} sx={sx}>
        <InputLabel>{label}</InputLabel>
        <Select label={label} fullWidth={fullWidth} ref={ref} {...rest}>
          {children}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);
