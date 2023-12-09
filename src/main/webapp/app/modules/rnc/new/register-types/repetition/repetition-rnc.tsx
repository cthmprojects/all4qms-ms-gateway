import React from 'react';
import { Card, Checkbox, Fab, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { Add, DeleteOutlined, EditOutlined, UploadFileOutlined } from '@mui/icons-material';

export const RepetitionRnc = () => {
  return (
    <Card className="pt-3 pb-3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex' }}>
        <FormControlLabel control={<Checkbox />} label="Reincidência" />
        <FormControl className="form-field">
          <InputLabel>Documento anterior</InputLabel>
          <Select label="Documento anterior">
            <MenuItem value="1">...</MenuItem>
          </Select>
        </FormControl>

        <IconButton sx={{ width: '50px', height: '50px' }}>
          <UploadFileOutlined></UploadFileOutlined>
        </IconButton>
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <EditOutlined></EditOutlined>
        </IconButton>
        <IconButton sx={{ width: '50px', height: '50px' }}>
          <DeleteOutlined></DeleteOutlined>
        </IconButton>
      </div>
      <Fab color="primary" aria-label="add" size="medium">
        <Add />
      </Fab>
    </Card>
  );
};

export default RepetitionRnc;
