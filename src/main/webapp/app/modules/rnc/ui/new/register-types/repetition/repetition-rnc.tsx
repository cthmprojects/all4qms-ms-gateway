import {
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Rnc } from 'app/modules/rnc/models';
import React from 'react';

type RncRepetitionProps = {
  onRepetitionChanged: (value: boolean) => void;
  onSelectedRncIdsChanged: (values: Array<number>) => void;
  repetition: boolean;
  rncs: Array<Rnc>;
  selectedRncIds: Array<number>;
};

export const RepetitionRnc = ({ onRepetitionChanged, onSelectedRncIdsChanged, repetition, rncs, selectedRncIds }: RncRepetitionProps) => {
  const onChanged = (event: SelectChangeEvent<Array<number>>) => {
    const { value } = event.target;

    if (typeof value !== 'string') {
      onSelectedRncIdsChanged(value);
    } else {
      const splitted = value.split(',');
      onSelectedRncIdsChanged(splitted.map(s => parseInt(s)));
    }
  };

  return (
    <>
      <Card className="pt-3 pb-3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <FormControlLabel control={<Checkbox onChange={(_, checked) => onRepetitionChanged(checked)} />} label="Reincidência" />
          <FormControl className="form-field">
            <InputLabel>Documento anterior</InputLabel>
            <Select
              multiple
              disabled={!repetition}
              value={selectedRncIds}
              onChange={onChanged}
              input={<OutlinedInput label="Tag" />}
              renderValue={selected => selected.join(', ')}
            >
              {rncs.map(rnc => {
                const set = new Set<number>(selectedRncIds);

                return (
                  <MenuItem key={rnc.id} value={rnc.id}>
                    <Checkbox checked={set.has(rnc.id)} />
                    <ListItemText primary={rnc.id} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </Card>
    </>
  );
};

export default RepetitionRnc;
