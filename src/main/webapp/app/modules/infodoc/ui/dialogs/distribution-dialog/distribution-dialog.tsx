import { Textarea } from '@mui/joy';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import DeleteIcon from '@mui/icons-material/Delete';

const getProcesses = async () => {
  const apiUrl = 'services/all4qmsmsgateway/api/processos';
  const response = await axios.get(`${apiUrl}`);
  return response.data;
};

type DistributionDialogProps = {
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
};
export const DistributionDialog = ({ open, handleClose, documentTitle }: DistributionDialogProps) => {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');

  useEffect(() => {
    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        setSelectedProcess(data[0].id);
      }
    });
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'}>
      <DialogTitle id="alert-dialog-title">
        <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Distribuição</h1>
        <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{documentTitle}</h3>
      </DialogTitle>
      <DialogContent>
        <Table className="w-100">
          <TableHead>
            <TableRow>
              <TableCell align="left">Tipo de controle</TableCell>
              <TableCell align="left">Processo</TableCell>
              <TableCell align="left">Tipo de cópia</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Select value={1} sx={{ minWidth: '150px' }}>
                  <MenuItem value={1}>CONTROLADA</MenuItem>
                  <MenuItem value={2}>NÃO CONTROLADA</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Select sx={{ minWidth: '150px' }} value={selectedProcess} onChange={event => setSelectedProcess(event.target.value)}>
                  {processes.map((process, i) => (
                    <MenuItem value={process.id} key={`process-${i}`}>
                      {process.nome}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <div style={{ display: 'flex' }}>
                  <FormControlLabel label="Eletrônico" control={<Checkbox />} />
                  <FormControlLabel label="Físico" control={<Checkbox />} />
                </div>
              </TableCell>
              <TableCell>
                <TextField label="Qtd" type="number" sx={{ width: '100px' }} />
              </TableCell>
              <TableCell>
                <IconButton color="primary">
                  <DeleteIcon sx={{ color: '#0000008F' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button className="format-button" onClick={handleClose}>
          Voltar
        </Button>
        <Button className="ms-3 me-3 format-button" variant="contained" color="primary" style={{ background: '#EBC139', color: '#384150' }}>
          DISTRIBUIR
        </Button>
      </DialogActions>
    </Dialog>
  );
};
