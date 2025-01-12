import { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

type ConfirmDialogOptions = {
  title?: string;
  content?: string;
  onConfirm: () => void;
};

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

  const showDialog = useCallback((dialogOptions: ConfirmDialogOptions) => {
    setOptions(dialogOptions);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    options?.onConfirm();
    setOpen(false);
  }, [options]);

  const ConfirmDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{options?.title || 'Confirmação'}</DialogTitle>
      <DialogContent>{options?.content || 'Tem certeza que deseja excluir?'}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="error">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { showDialog, ConfirmDialog };
}
