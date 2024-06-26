import { Chip, TextField, createTheme } from '@mui/material';
import Downshift from 'downshift';
import React, { useEffect, useState } from 'react';

// docs: https://codesandbox.io/p/sandbox/material-ui-input-with-chips-0s2j4?file=%2Fsrc%2FTagsInput.js%3A12%2C9-18%2C21

type IInputChipsProps = {
  selectedTags: () => void;
  fullWidth?: boolean;
  label: string;
  className?: string;
};

const useStyles = () =>
  createTheme({
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            margin: '0 10px',
          },
        },
      },
    },
  });

const InputChips = ({ ...props }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const { selectedTags, placeholder, ...other } = props;
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    selectedTags(tags);
  }, [tags]);

  const handleChange = item => {
    let newSelectedItem = [...tags];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue('');
    setTags(newSelectedItem);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      const newSelectedItem = [...tags];
      const duplicatedValues = newSelectedItem.indexOf(event.target.value.trim());

      if (duplicatedValues !== -1) {
        setInputValue('');
        return;
      }
      if (!event.target.value.replace(/\s/g, '').length) return;

      newSelectedItem.push(event.target.value.trim());
      setTags(newSelectedItem);
      setInputValue('');
    }
    if (tags.length && !inputValue.length && event.key === 'Backspace') {
      setTags(tags.slice(0, tags.length - 1));
    }
  };

  const handleDelete = item => {
    const newSelectedItem = [...tags];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setTags(newSelectedItem);
  };

  return (
    <React.Fragment>
      <Downshift inputValue={inputValue} onChange={handleChange} selectedItem={tags}>
        {({ getInputProps }) => {
          const { onBlur, onChange, ...inputProps } = getInputProps({
            onKeyDown: handleKeyDown,
            placeholder: placeholder,
          });
          return (
            <div>
              <TextField
                sx={{ height: '60px', overflowX: 'overlay' }}
                InputProps={{
                  startAdornment: tags.map(item => (
                    <Chip key={item} tabIndex={-1} label={item} className="" onDelete={() => handleDelete(item)} />
                  )),
                  onBlur,
                  onChange: event => {
                    setInputValue(event.target.value);
                    onChange(event);
                  },
                }}
                {...other}
                {...inputProps}
              ></TextField>
            </div>
          );
        }}
      </Downshift>
    </React.Fragment>
  );
};

export default InputChips;
