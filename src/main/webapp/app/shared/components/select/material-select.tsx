import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { forwardRef } from 'react';

export const MaterialSelect = forwardRef(
  (
    { fullWidth, children, className, variant, required, label, sx, error, helperText, ...rest }: SelectProps & { helperText?: string },
    ref
  ) => {
    if (rest.value == 0) rest.value = '';
    return (
      <FormControl className={className} variant={variant} required={required} fullWidth={fullWidth} error={error} sx={sx}>
        <InputLabel>{label}</InputLabel>
        <Select label={label} fullWidth={fullWidth} ref={ref} {...rest} defaultValue="">
          {rest && rest?.value && (
            //@ts-ignore
            <MenuItem sx={{ display: 'none' }} value={rest?.value}>
              {rest.renderValue ? rest.renderValue(rest?.value) : (rest?.value as string)}
            </MenuItem>
          )}
          {children}
        </Select>
        {helperText && <FormHelperText>{helperText || (rest.value as string)}</FormHelperText>}
      </FormControl>
    );
  }
);
