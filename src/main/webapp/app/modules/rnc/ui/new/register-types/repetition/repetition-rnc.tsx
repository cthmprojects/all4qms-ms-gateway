import React, { useState } from 'react';
import {
  Card,
  Checkbox,
  Fab,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast } from 'react-toastify';

export const RepetitionRnc = ({ RNCList, handleUpdateRNC, RNCID }) => {
  const [listRepetitions, setListRepetitions] = useState([]);
  const [selectFileDisable, setSelectFileDisable] = useState(true);

  const handleChange = (event: SelectChangeEvent<typeof listRepetitions>) => {
    const {
      target: { value },
    } = event;
    handleUpdateRNC(typeof value === 'string' ? value.split(',') : value);

    setListRepetitions(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <>
      <Card className="pt-3 pb-3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <FormControlLabel control={<Checkbox onChange={() => setSelectFileDisable(!selectFileDisable)} />} label="Reincidência" />
          <FormControl className="form-field">
            <InputLabel>Documento anterior</InputLabel>
            <Select
              multiple
              disabled={selectFileDisable}
              value={listRepetitions}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={selected => selected.join(', ')}
            >
              {RNCList.map(rnc => (
                <MenuItem key={rnc.id} value={rnc.id}>
                  <Checkbox checked={listRepetitions.indexOf(rnc.id) > -1} />
                  <ListItemText primary={rnc.id} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Card>
    </>
  );
};

export default RepetitionRnc;
