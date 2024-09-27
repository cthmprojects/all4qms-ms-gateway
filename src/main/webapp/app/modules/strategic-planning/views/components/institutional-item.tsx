import { TextField } from '@mui/material';

type InstitutionalItemProps = {
  label: string;
  placeholder: string;
  onChanged: (newValue: string) => void;
  readonly?: boolean;
  value: string;
};

const InstitutionalItem = ({ label, placeholder, onChanged, readonly, value }: InstitutionalItemProps) => {
  const onValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const newValue: string = event.target.value;
    onChanged(newValue);
  };

  return (
    <TextField
      disabled={readonly}
      label={label}
      onChange={onValueChanged}
      placeholder={placeholder}
      value={value}
      variant="outlined"
      sx={{ flexGrow: 1 }}
    />
  );
};

export default InstitutionalItem;
