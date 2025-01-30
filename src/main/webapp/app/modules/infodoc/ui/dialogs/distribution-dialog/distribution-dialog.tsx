import { Textarea } from '@mui/joy';
import {
  Box,
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
  SelectChangeEvent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import DeleteIcon from '@mui/icons-material/Delete';
import { DetalheDistribuicao, Distribuicao, EnumTipoControleDoc } from '../../../models/distribuicao';
import { buscarDistribuicao, cadastrarDetailDistribuicao, cadastrarDistribuicao } from '../../../reducers/distribuicao.reducer';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { LoadingButton } from '@mui/lab';

const getProcesses = async () => {
  const apiUrl = 'services/all4qmsmsgateway/api/processos';
  const response = await axios.get(`${apiUrl}`);
  return response.data;
};

const InnerTextarea = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={70} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Motivo da Solicitação</StyledLabel>
    </React.Fragment>
  );
});

type CopyType = 'ELETRONIC' | 'PHYSICAL';

type DistributionDialogProps = {
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
  idDoc?: number;
};
export const DistributionDialog = ({ open, handleClose, documentTitle, idDoc }: DistributionDialogProps) => {
  const dispatch = useAppDispatch();

  const [processes, setProcesses] = useState([]);
  const [distribuicao, setDistribuicao] = useState<Distribuicao>();
  const [typeControl, setTypeControl] = useState<EnumTipoControleDoc | null>(null);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [typeCopy, setTypeCopy] = useState<CopyType | null>(null);
  const [amountCopy, setAmountCopy] = useState(0);
  const [motivoSolicitacao, setMotivoSolicitacao] = useState('');
  const [isNextPageJustify, setIsNextPageJustify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        0;
        setSelectedProcess(data[0].id);
      }
    });
  }, []);

  const handleChangeType = (type: CopyType) => {
    setTypeCopy(prev => (prev === type ? null : type));
  };

  const handleChangeControl = (event: SelectChangeEvent<EnumTipoControleDoc>) => {
    setTypeControl(event.target.value as EnumTipoControleDoc);
  };

  const handleDistribuir = async () => {
    setIsLoading(true);
    if (!typeControl || !selectedProcess) {
      toast.error('Por favor, selecione o tipo de controle e um processo.');
      setIsLoading(false);
      return;
    }

    const novaDistribuicao: Distribuicao = {
      idDocumentacao: idDoc!!, // Defina o ID real do documento aqui
      enumTipoControleDoc: typeControl,
      idProcesso: parseInt(selectedProcess, 0),
      qtdCopiaEletronica: typeCopy === 'ELETRONIC' ? amountCopy : 0,
      qtdCopiaFisica: typeCopy === 'PHYSICAL' ? amountCopy : 0,
    };

    const respCad = await dispatch(cadastrarDistribuicao(novaDistribuicao));
    if (respCad) {
      const resDistri: Distribuicao = (respCad.payload as AxiosResponse).data || {};
      setDistribuicao(resDistri);
    }
    setIsNextPageJustify(true);
    setIsLoading(false);
  };

  const handleSolicitar = async () => {
    setIsLoading(true);
    if (!motivoSolicitacao) {
      toast.error('Por favor, justificativa não deve ficar vazia!');
      return;
    }

    const novaDetailDistribuicao: DetalheDistribuicao = {
      idDistribuicaoDoc: distribuicao?.id!!,
      cometarioSolicitacao: motivoSolicitacao,
    };

    await dispatch(cadastrarDetailDistribuicao(novaDetailDistribuicao));
    setIsLoading(false);
    handleClose();
    setIsNextPageJustify(false);
  };
  const tableDistribuiiition = () => (
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
            <Select value={typeControl || ''} onChange={handleChangeControl} sx={{ minWidth: '150px' }} displayEmpty>
              <MenuItem value="" disabled>
                Selecione o Tipo
              </MenuItem>
              <MenuItem value={'C'}>{EnumTipoControleDoc.C}</MenuItem>
              <MenuItem value={'N'}>{EnumTipoControleDoc.N}</MenuItem>
            </Select>
          </TableCell>
          <TableCell>
            <Select sx={{ minWidth: '150px' }} value={selectedProcess} onChange={event => setSelectedProcess(event.target.value)}>
              {processes.map((process: any, i) => (
                <MenuItem value={process.id} key={`process-${i}`}>
                  {process?.nome}
                </MenuItem>
              ))}
            </Select>
          </TableCell>
          <TableCell>
            <div style={{ display: 'flex' }}>
              <FormControlLabel
                label="Eletrônico"
                control={<Checkbox checked={typeCopy === 'ELETRONIC'} onChange={() => handleChangeType('ELETRONIC')} />}
              />
              <FormControlLabel
                label="Físico"
                control={<Checkbox checked={typeCopy === 'PHYSICAL'} onChange={() => handleChangeType('PHYSICAL')} />}
              />
            </div>
          </TableCell>
          <TableCell>
            <TextField
              label="Qtd"
              type="number"
              value={amountCopy}
              onChange={e => setAmountCopy(parseInt(e.target.value))}
              sx={{ width: '100px' }}
            />
          </TableCell>
          <TableCell>
            <IconButton color="primary">
              <DeleteIcon sx={{ color: '#0000008F' }} />
            </IconButton>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  const justifyDistribuition = () => (
    <Box>
      <Textarea
        className="w-200"
        slots={{ textarea: InnerTextarea }}
        slotProps={{ textarea: { placeholder: '' } }}
        sx={{ borderRadius: '6px' }}
        name="ncArea"
        value={motivoSolicitacao || ''}
        onChange={e => setMotivoSolicitacao(e.target.value)}
      />
    </Box>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'}>
      <DialogTitle id="alert-dialog-title">
        <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Distribuição</h1>
        <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{documentTitle}</h3>
      </DialogTitle>
      <DialogContent>{!isNextPageJustify ? tableDistribuiiition() : justifyDistribuition()}</DialogContent>
      <DialogActions>
        <Button className="format-button" onClick={handleClose}>
          Voltar
        </Button>
        <LoadingButton
          className="ms-3 me-3 format-button"
          variant="contained"
          color="primary"
          loading={isLoading}
          disabled={isLoading}
          style={{ background: isLoading ? '#cacaca' : '#EBC139', color: isLoading ? '#cacaca' : '#384150' }}
          onClick={isNextPageJustify ? handleSolicitar : handleDistribuir}
        >
          {isNextPageJustify ? 'SOLICITAR' : 'DISTRIBUIR'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
