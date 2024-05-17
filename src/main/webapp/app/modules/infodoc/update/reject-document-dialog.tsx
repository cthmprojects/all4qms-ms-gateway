import { Textarea } from '@mui/joy';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import React from 'react';
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
  openModal: boolean;
  handleClose: () => void;
};
export const RejectDocumentDialog = ({ openModal, handleClose }: RejectDialogProps) => {
  return (
    <React.Fragment>
      <Dialog open={openModal} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <h1 style={{ fontSize: '1.2rem' }}>Justificar reprovação</h1>
          <h3 style={{ fontSize: '1rem' }}>Documento ... - 000 </h3>
        </DialogTitle>
        <DialogContent>
          <Textarea
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={handleClose}>
            Voltar
          </Button>
          <Button className="ms-3" variant="contained" color="primary" style={{ background: '#A23900', color: '#fff' }}>
            Reprovar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
