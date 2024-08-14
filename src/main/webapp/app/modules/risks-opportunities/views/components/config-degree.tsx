import { Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import InputDegreeColor from './input-degree-color';
import { onTextChanged } from '../../utils';

type ConfigDegreeProps = {
  code?: number;
  color?: string;
  decision?: string;
  description: string;
  label?: string;
  title: string;
  weight?: number;
  onChanged: (description: string) => void;
};

const ConfigDegree = ({ code, color, decision, description, label, title, weight, onChanged }: ConfigDegreeProps) => {
  const [isDegree, setIsDegree] = useState<boolean>(false);
  const [desc, setDesc] = useState<string>('');

  const initialDescription = useMemo(() => {
    return description;
  }, [description]);

  useEffect(() => {
    setDesc(initialDescription);
  }, [initialDescription]);

  useEffect(() => {
    setIsDegree(!code && !decision);
  }, [code, decision]);

  return (
    <Stack direction="row" spacing={2}>
      {isDegree ? (
        <>
          <InputDegreeColor label="Grau" color={color ?? 'black'} value={label ?? ''} InputProps={{ readOnly: true }} />
          <TextField label="Peso" placeholder="Peso" value={weight?.toString() ?? ''} InputProps={{ readOnly: true }} />
        </>
      ) : (
        <>
          <TextField label="Código" placeholder="Código" value={code?.toString() ?? ''} InputProps={{ readOnly: true }} />
          <TextField label="Decisão" placeholder="Decisão" value={decision ?? ''} InputProps={{ readOnly: true }} />
        </>
      )}
      <TextField
        label="Descrição"
        onChange={event => onChanged(event.target.value)}
        placeholder={`Descrição do grau de ${title ?? ''}`}
        value={desc}
        sx={{ flexGrow: 1 }}
      />
    </Stack>
  );
};

export default ConfigDegree;
