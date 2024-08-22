import React, { useState } from 'react';
import './select.css';

export interface SelectProps {
  label?: string;
  disabled?: boolean;
  handleChange?: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
  options: string[];
}

export const Select = ({ label, disabled = false, handleChange, style, className, options }: SelectProps) => {
  const change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(event.target.value);
  };

  return (
    <div className={`select-material me-2 ${className}`} style={style}>
      <select onChange={e => change(e)} className="select-text" required disabled={disabled}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label className="select-label">{label}</label>
    </div>
  );
};

export default Select;
