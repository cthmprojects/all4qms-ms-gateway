import React from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
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
  withoutClear,
  startDate,
  endDate,
  selectsRange,
  showMonthDropdown,
  showYearDropdown,
  error,
  helperText,
  onBlur,
  required,
  ...props
}: Omit<TextFieldProps, 'onChange'> &
  React.ComponentProps<typeof DatePicker> & { onChange: (date: Date) => void; hideHeader?: boolean }) => {
  const format = dateFormat || 'dd/MM/yyyy';

  const clear =
    withoutClear || disabled
      ? {}
      : {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => onChange('')} edge="end">
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        };

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={format}
      disabled={disabled}
      showMonthYearPicker={showMonthYearPicker}
      showYearPicker={showYearPicker}
      startDate={startDate}
      endDate={endDate}
      selectsRange={selectsRange}
      showMonthDropdown={showMonthDropdown}
      showYearDropdown={showYearDropdown}
      required={required}
      onBlur={onBlur}
      locale="pt-BR"
      {...(hideHeader ? { renderCustomHeader: () => null } : {})}
      customInput={
        <TextField
          {...props}
          error={error}
          helperText={helperText}
          InputProps={{
            readOnly: true,
            ...clear,
          }}
        />
      }
    />
  );
};
