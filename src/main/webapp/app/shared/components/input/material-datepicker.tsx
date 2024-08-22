import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import DatePicker from 'react-datepicker';

export const MaterialDatepicker = ({
  selected,
  onChange,
  value,
  disabled,
  dateFormat,
  showMonthYearPicker,
  ...props
}: TextFieldProps & React.ComponentProps<typeof DatePicker>) => {
  const format = dateFormat || 'dd/MM/yyyy';
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={format}
      disabled={disabled}
      showMonthYearPicker={showMonthYearPicker}
      locale="pt-BR"
      customInput={
        <TextField
          {...props}
          InputProps={{
            readOnly: true,
          }}
        />
      }
    />
  );
};
