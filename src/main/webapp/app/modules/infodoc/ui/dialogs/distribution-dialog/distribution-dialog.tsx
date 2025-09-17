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
import AddIcon from '@mui/icons-material/Add';
import { DetalheDistribuicao, Distribuicao, EnumTipoControleDoc } from '../../../models/distribuicao';
import { buscarDistribuicao, cadastrarDetailDistribuicao, cadastrarDistribuicao } from '../../../reducers/distribuicao.reducer';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { LoadingButton } from '@mui/lab';
import { Storage } from 'react-jhipster';
import { UserQMS } from '../../../../../entities/usuario/reducers/usuario.reducer';

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
  const [userQMS, setUserQMS] = useState<UserQMS>(JSON.parse(Storage.session.get('USUARIO_QMS')));

  // Estados para múltiplas linhas
  const [distributionRows, setDistributionRows] = useState([
    {
      id: 1,
      typeControl: null as EnumTipoControleDoc | null,
      selectedProcess: '',
      typeCopy: null as CopyType | null,
      amountCopy: 0,
    },
  ]);

  useEffect(() => {
    getProcesses().then(data => {
      setProcesses(data);
      if (data.length > 0) {
        setSelectedProcess(data[0].id);
        // Inicializar a primeira linha com o primeiro processo
        setDistributionRows([
          {
            id: 1,
            typeControl: null,
            selectedProcess: data[0].id.toString(),
            typeCopy: null,
            amountCopy: 0,
          },
        ]);
      }
    });
  }, []);

  // Função para adicionar nova linha
  const addNewRow = () => {
    const newId = Math.max(...distributionRows.map(r => r.id)) + 1;
    setDistributionRows(prev => [
      ...prev,
      {
        id: newId,
        typeControl: null,
        selectedProcess: processes.length > 0 ? processes[0].id.toString() : '',
        typeCopy: null,
        amountCopy: 0,
      },
    ]);
  };

  // Função para remover linha
  const removeRow = (id: number) => {
    if (distributionRows.length > 1) {
      setDistributionRows(prev => prev.filter(row => row.id !== id));
    }
  };

  // Função para atualizar linha
  const updateRow = (id: number, field: string, value: any) => {
    setDistributionRows(prev => prev.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleChangeType = (type: CopyType) => {
    setTypeCopy(prev => {
      const newType = prev === type ? null : type;
      if (newType === 'ELETRONIC') {
        setAmountCopy(1); // Força quantidade 1 para cópia eletrônica
      } else if (newType === 'PHYSICAL') {
        setAmountCopy(1); // Valor padrão 1 para cópia física
      } else {
        setAmountCopy(0); // Reseta quando desmarca
      }
      return newType;
    });
  };

  const handleAmountChange = (value: string) => {
    const newValue = parseInt(value);
    if (typeCopy === 'ELETRONIC') {
      setAmountCopy(1); // Mantém 1 para cópia eletrônica
    } else if (typeCopy === 'PHYSICAL') {
      if (newValue > 0) {
        setAmountCopy(newValue);
      }
    }
  };

  const handleChangeControl = (event: SelectChangeEvent<EnumTipoControleDoc>) => {
    setTypeControl(event.target.value as EnumTipoControleDoc);
  };

  const handleDistribuir = async () => {
    setIsLoading(true);

    // Validar todas as linhas
    const invalidRows = distributionRows.filter(row => !row.typeControl || !row.selectedProcess || !row.typeCopy || row.amountCopy <= 0);

    if (invalidRows.length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios em todas as linhas.');
      setIsLoading(false);
      return;
    }

    try {
      // Processar cada linha
      for (const row of distributionRows) {
        const novaDistribuicao: Distribuicao = {
          idDocumentacao: idDoc!!,
          enumTipoControleDoc: row.typeControl!!,
          idProcesso: parseInt(row.selectedProcess, 10),
          qtdCopiaEletronica: row.typeCopy === 'ELETRONIC' ? row.amountCopy : 0,
          qtdCopiaFisica: row.typeCopy === 'PHYSICAL' ? row.amountCopy : 0,
        };

        const respCad = await dispatch(cadastrarDistribuicao(novaDistribuicao));
        if (respCad) {
          const resDistri: Distribuicao = (respCad.payload as AxiosResponse).data || {};
          setDistribuicao(resDistri);

          const novaDetailDistribuicao: DetalheDistribuicao = {
            idDistribuicaoDoc: resDistri?.id!!,
            cometarioSolicitacao: '',
            idUsuarioEntrega: userQMS.id,
          };

          await dispatch(cadastrarDetailDistribuicao(novaDetailDistribuicao));
        }
      }

      toast.success(`${distributionRows.length} distribuição(ões) criada(s) com sucesso!`);
      setIsLoading(false);
      handleClose();
    } catch (error) {
      toast.error('Erro ao criar distribuições. Tente novamente.');
      setIsLoading(false);
    }
  };

  // const handleSolicitar = async () => {
  //   setIsLoading(true);
  //   if (!motivoSolicitacao) {
  //     toast.error('Por favor, justificativa não deve ficar vazia!');
  //     return;
  //   }

  //   const novaDetailDistribuicao: DetalheDistribuicao = {
  //     idDistribuicaoDoc: distribuicao?.id!!,
  //     cometarioSolicitacao: motivoSolicitacao,
  //     idUsuarioEntrega: userQMS.id,
  //   };

  //   await dispatch(cadastrarDetailDistribuicao(novaDetailDistribuicao));
  //   setIsLoading(false);
  //   handleClose();
  //   setIsNextPageJustify(false);
  // };
  const tableDistribuiiition = () => (
    <Box>
      <Table className="w-100">
        <TableHead>
          <TableRow>
            <TableCell align="left">Tipo de controle</TableCell>
            <TableCell align="left">Processo</TableCell>
            <TableCell align="left">Tipo de cópia</TableCell>
            <TableCell align="left">Quantidade</TableCell>
            <TableCell align="left">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {distributionRows.map(row => (
            <TableRow key={row.id}>
              <TableCell>
                <Select
                  value={row.typeControl || ''}
                  onChange={e => updateRow(row.id, 'typeControl', e.target.value)}
                  sx={{ minWidth: '150px' }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecione o Tipo
                  </MenuItem>
                  <MenuItem value={'C'}>{EnumTipoControleDoc.C}</MenuItem>
                  <MenuItem value={'N'}>{EnumTipoControleDoc.N}</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  sx={{ minWidth: '150px' }}
                  value={row.selectedProcess}
                  onChange={e => updateRow(row.id, 'selectedProcess', e.target.value)}
                >
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
                    control={
                      <Checkbox
                        checked={row.typeCopy === 'ELETRONIC'}
                        onChange={e => {
                          const newType = e.target.checked ? 'ELETRONIC' : null;
                          updateRow(row.id, 'typeCopy', newType);
                          updateRow(row.id, 'amountCopy', newType === 'ELETRONIC' ? 1 : 0);
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Físico"
                    control={
                      <Checkbox
                        checked={row.typeCopy === 'PHYSICAL'}
                        onChange={e => {
                          const newType = e.target.checked ? 'PHYSICAL' : null;
                          updateRow(row.id, 'typeCopy', newType);
                          updateRow(row.id, 'amountCopy', newType === 'PHYSICAL' ? 1 : 0);
                        }}
                      />
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                <TextField
                  label="Qtd"
                  type="number"
                  value={row.amountCopy}
                  onChange={e => updateRow(row.id, 'amountCopy', parseInt(e.target.value) || 0)}
                  disabled={row.typeCopy === 'ELETRONIC'}
                  inputProps={{ min: 1 }}
                  sx={{ width: '100px' }}
                />
              </TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => removeRow(row.id)} disabled={distributionRows.length === 1}>
                  <DeleteIcon sx={{ color: distributionRows.length === 1 ? '#ccc' : '#0000008F' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Botão para adicionar nova linha - VISÍVEL */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewRow}
          sx={{
            backgroundColor: '#e6b200',
            color: '#4e4d4d',
            '&:hover': {
              backgroundColor: '#d4a500',
            },
          }}
        >
          + Adicionar Linha
        </Button>
      </Box>
    </Box>
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
          // onClick={isNextPageJustify ? handleSolicitar : handleDistribuir}
          onClick={handleDistribuir}
        >
          {isNextPageJustify ? 'SOLICITAR' : 'DISTRIBUIR'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
