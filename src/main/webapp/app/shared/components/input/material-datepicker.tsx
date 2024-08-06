import { TextField, TextFieldProps } from '@mui/material';
import DatePicker from 'react-datepicker';

export const MaterialDatepicker = ({ selected, onChange, value, ...props }: TextFieldProps & React.ComponentProps<typeof DatePicker>) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={'dd/MM/yyyy'}
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
