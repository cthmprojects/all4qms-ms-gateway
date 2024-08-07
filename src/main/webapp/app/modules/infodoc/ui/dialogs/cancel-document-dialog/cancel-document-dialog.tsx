import { Textarea } from '@mui/joy';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { InfoDoc } from 'app/modules/infodoc/models';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { cancelDocument } from 'app/modules/infodoc/reducers/infodoc.reducer';
import { useAppDispatch } from 'app/config/store';

const DocumentDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();

  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={100} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Motivo da solicitação</StyledLabel>
    </React.Fragment>
  );
});

type CancelDocumentDialogProps = {
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
  infodoc: InfoDoc;
  userId: number;
};

export const CancelDocumentDialog = ({ open, handleClose, documentTitle, infodoc, userId }: CancelDocumentDialogProps) => {
  const dispatch = useAppDispatch();
  const [justifyValue, setJustifyValue] = useState('');
  const requestCancelInfoDoc = (justify: string) => {
    const params = { id: infodoc.doc.id, userLoginID: userId, justify };

    dispatch(cancelDocument(params)).then(
      (response: any) => {
        if (response?.error) {
          handleClose();
          return;
        }

        handleClose();
      },
      err => {
        return;
      }
    );
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Solicitar Cancelamento</h1>
          <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{documentTitle}</h3>
        </DialogTitle>
        <DialogContent>
          <Textarea
            id="justify"
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={justifyValue || ''}
            onChange={e => setJustifyValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ paddingBottom: '20px' }}>
          <Button className="format-button" onClick={handleClose}>
            Voltar
          </Button>
          <Button
            className="ms-3 me-3 format-button"
            variant="contained"
            color="primary"
            style={{ background: '#A23900', color: '#fff' }}
            onClick={() => requestCancelInfoDoc(justifyValue)}
          >
            Solicitar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
