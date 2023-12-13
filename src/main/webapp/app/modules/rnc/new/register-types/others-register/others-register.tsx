import { TextField } from '@mui/material';
import React, { useState } from 'react';

export const OthersRegister = ({ onOthersRegisterChange }) => {
  const [othersForm, setOthersForm] = useState({
    others: {
      value: '',
      error: false,
    },
  });

  const handleChange = (value: any) => {
    setOthersForm(value);
    onOthersRegisterChange(othersForm);
  };

  return (
    <>
      <TextField
        value={othersForm.others.value}
        onChange={e => handleChange({ ...othersForm, others: { value: e.target.value, error: false } })}
        label="Escreva aqui..."
        name="others-register-field"
        className="m-2 mb-3"
        sx={{ paddingRight: '20px' }}
      />
    </>
  );
};

export default OthersRegister;
