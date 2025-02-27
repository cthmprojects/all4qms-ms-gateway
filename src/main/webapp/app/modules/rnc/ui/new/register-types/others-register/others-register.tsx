import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

type OthersRegisterProps = {
  initialData: string;
  onChanged: (others: string) => void;
};

export const OthersRegister = ({ initialData, onChanged }: OthersRegisterProps) => {
  const [others, setOthers] = useState<string>(initialData);

  useEffect(() => {
    onChanged(others);
  }, [others]);

  return (
    <>
      <TextField
        value={others}
        onChange={e => setOthers(e.target.value)}
        label="Escreva aqui..."
        name="others-register-field"
        className="m-2 mb-3"
        sx={{ paddingRight: '20px' }}
      />
    </>
  );
};

export default OthersRegister;
