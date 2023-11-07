import React from 'react';
import { Card, Checkbox, Fab, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { Add, DeleteOutlined, EditOutlined, UploadFileOutlined } from '@mui/icons-material';

export const RepetitionRnc = () => {
  return (
    <Card className="pt-3 pb-3" sx={{ display: 'flex', alignContent: 'center' }}>
      <FormControlLabel control={<Checkbox />} label="Reincidência" />
      <FormControl className="form-field mt-2">
        <InputLabel>Origem</InputLabel>
        <Select label="Documento anterior">
          <MenuItem value="1">Auditoria externa</MenuItem>
        </Select>
      </FormControl>

      <IconButton>
        <UploadFileOutlined></UploadFileOutlined>
      </IconButton>
      <IconButton>
        <EditOutlined></EditOutlined>
      </IconButton>
      <IconButton>
        <DeleteOutlined></DeleteOutlined>
      </IconButton>
      <Fab color="primary" aria-label="add" size="medium">
        <Add />
      </Fab>
    </Card>
  );
};

export default RepetitionRnc;
