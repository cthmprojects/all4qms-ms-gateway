import React, { useState } from 'react';
import { Card, Checkbox, Fab, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { Add, DeleteOutlined, EditOutlined, UploadFileOutlined } from '@mui/icons-material';

export const RepetitionRnc = () => {
  const [listRepetitions, setListRepetitions] = useState([]);
  const [selectFileDisable, setSelectFileDisable] = useState(true);

  const renderListRepetitions = () => {
    return listRepetitions.map((repetition, index) => {
      return (
        <div key={index} className="mt-2 mb-2">
          <FormControlLabel control={<Checkbox />} label="Reincidência" />
          <FormControl className="form-field">
            <InputLabel>Documento anterior</InputLabel>
            <Select label="Documento anterior" disabled>
              <MenuItem value="1">...</MenuItem>
            </Select>
          </FormControl>

          {/* <IconButton sx={{ width: '50px', height: '50px' }}>
            <EditOutlined></EditOutlined>
          </IconButton> */}
          <IconButton sx={{ width: '50px', height: '50px' }} onClick={() => handleRemoveRepetition(index)}>
            <DeleteOutlined></DeleteOutlined>
          </IconButton>
        </div>
      );
    });
  };

  const handleAddRepetition = () => {
    setListRepetitions([...listRepetitions, 1]);
  };

  const handleRemoveRepetition = (index: number) => {
    const updatedList = [...listRepetitions];
    updatedList.splice(index, 1);
    setListRepetitions(updatedList);
  };

  return (
    <>
      <Card className="pt-3 pb-3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <FormControlLabel control={<Checkbox onChange={() => setSelectFileDisable(!selectFileDisable)} />} label="Reincidência" />
          <FormControl className="form-field">
            <InputLabel>Documento anterior</InputLabel>
            <Select label="Documento anterior" disabled={selectFileDisable}>
              <MenuItem value="1">...</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Fab color="primary" aria-label="add" size="medium" onClick={handleAddRepetition}>
          <Add />
        </Fab>
      </Card>
      {renderListRepetitions()}
    </>
  );
};

export default RepetitionRnc;
