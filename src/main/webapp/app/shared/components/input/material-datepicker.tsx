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
  showYearPicker,
  hideHeader,
  ...props
}: Omit<TextFieldProps, 'onChange'> &
  React.ComponentProps<typeof DatePicker> & { onChange: (date: Date) => void; hideHeader?: boolean }) => {
  const format = dateFormat || 'dd/MM/yyyy';
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={format}
      disabled={disabled}
      showMonthYearPicker={showMonthYearPicker}
      showYearPicker={showYearPicker}
      locale="pt-BR"
      {...(hideHeader ? { renderCustomHeader: () => null } : {})}
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
