import { Textarea } from '@mui/joy';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import React from 'react';
import { Button } from 'reactstrap';
import './request-copy-dialog.css';

const DocumentDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={120} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Motivo da solicitação</StyledLabel>
    </React.Fragment>
  );
});

type RejectDialogProps = {
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
};
export const RequestCopyDialog = ({ open, handleClose, documentTitle }: RejectDialogProps) => {
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Solicitar cópia</h1>
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
        <DialogActions sx={{ paddingBottom: '20px' }}>
          <Button variant="contained" className="format-button" onClick={handleClose}>
            Voltar
          </Button>
          <Button className="ms-3 me-3 add-button format-button" variant="contained">
            Solicitar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
