import { Textarea } from '@mui/joy';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { EnumStatusDoc, EnumTipoMovDoc, InfoDoc, Movimentacao } from 'app/modules/infodoc/models';
import { cadastrarMovimentacao } from 'app/modules/infodoc/reducers/movimentacao.reducer';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';

const DocumentDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={100} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Justificativa de Reprovação</StyledLabel>
    </React.Fragment>
  );
});

type RejectDialogProps = {
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
  currentUser: any;
  currentDocument: InfoDoc;
};
export const RejectDocumentDialog = ({ open, handleClose, documentTitle, currentUser, currentDocument }: RejectDialogProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState('');

  const reprovalDocument = async () => {
    await axios
      .put(`services/all4qmsmsinfodoc/api/infodoc/documentos/cancelar/${currentDocument?.doc?.id}`, {
        idDocumento: currentDocument?.doc?.id,
        idUsuario: currentUser ? parseInt(currentUser.id) : 0,
        justificativa: description,
      })
      .then(() => {
        toast.success('Documento rejeitado!');
        navigate('/infodoc');
      })
      .catch(e => {
        toast.error('Erro ao rejeitar documento');
      });

    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Justificar reprovação</h1>
          <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{currentDocument?.doc?.titulo}</h3>
        </DialogTitle>
        <DialogContent>
          <Textarea
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            onChange={e => setDescription(e.target.value)}
            name="ncArea"
          />
        </DialogContent>
        <DialogActions>
          <Button className="format-button" onClick={handleClose}>
            Voltar
          </Button>
          <Button
            className="ms-3 me-3 format-button"
            variant="contained"
            color="primary"
            style={{ background: '#A23900', color: '#fff' }}
            onClick={() => reprovalDocument()}
          >
            Reprovar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
