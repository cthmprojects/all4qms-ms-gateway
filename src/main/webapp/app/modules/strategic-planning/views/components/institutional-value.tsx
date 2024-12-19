import { AddOutlined, DeleteOutlined } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';
import InstitutionalItem from './institutional-item';

type InstitutionalVisionProps = {
  onAdded?: () => void;
  onChanged?: (newValue: string) => void;
  onRemoved?: () => void;
  readonly?: boolean;
  value: string;
};

const InstitutionalVision = ({ onAdded, onChanged, onRemoved, readonly, value }: InstitutionalVisionProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        label="Valor"
        onChange={value => onChanged(value.target.value)}
        placeholder="Valor"
        disabled={!!readonly}
        fullWidth
        value={value}
      />

      {onAdded && (
        <Button disabled={value.length <= 0} onClick={onAdded}>
          <AddOutlined />
        </Button>
      )}

      {onRemoved && (
        <Button onClick={onRemoved}>
          <DeleteOutlined />
        </Button>
      )}
    </Stack>
  );
};

export default InstitutionalVision;
