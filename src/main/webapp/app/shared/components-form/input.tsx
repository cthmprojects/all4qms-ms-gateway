import React, { useState } from 'react';
import './input.css';

export interface InputProps {
  text: any;
  label?: string;
  disabled: boolean;
  handleChange?: (value: string) => void;
  style?: React.CSSProperties;
}

export const Input = ({ text, label, disabled = false, handleChange, style }: InputProps) => {
  const [value, setValue] = useState(text.toString());

  const handleValueChange = (value: string) => {
    setValue(value);
    if (handleChange) {
      handleChange(value);
    }
  };

  return (
    <div className="group" style={style}>
      <label htmlFor="e">{label}</label>
      <input onChange={e => handleValueChange(e.target.value)} disabled={disabled} value={value} className="rnc-input" id="e" />
    </div>
  );
};

export default Input;
