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
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
};
export const RejectDocumentDialog = ({ open, handleClose, documentTitle }: RejectDialogProps) => {
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Justificar reprovação</h1>
          <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{documentTitle}</h3>
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
          <Button className="format-button" onClick={handleClose}>
            Voltar
          </Button>
          <Button className="ms-3 me-3 format-button" variant="contained" color="primary" style={{ background: '#A23900', color: '#fff' }}>
            Reprovar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
