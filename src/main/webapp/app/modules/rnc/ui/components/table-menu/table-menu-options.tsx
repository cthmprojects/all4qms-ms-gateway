import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Stack, TextField } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import { Rnc } from 'app/modules/rnc/models';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelRnc, deleteRnc } from '../../../reducers/rnc.reducer';
import {
  canAccessDetailingInfo,
  canAccessElaborationPage,
  canAccessExecutionPage,
  canAccessFillingPage,
  canAccessInvestigationPage,
  canAccessRncCancelButton,
  canAccessRncDeleteButton,
  canAccessValidationPage,
  canAccessVerificationPage,
} from './controls';

interface props {
  rnc: Rnc;
  userId: string | number;
  userRole: string;
  reload: () => void;
}

const MenuOptions = ({ rnc, userId, userRole, reload }: props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openOptions = Boolean(anchorEl);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const cancel = (id: number) => {
    dispatch(cancelRnc({ id, reason }));
    reload();
  };

  const handleClickOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const goToPage = (route: string) => {
    handleCloseOptions();
    navigate(route);
  };

  const deleteRncById = (id: number) => {
    dispatch(deleteRnc(id));
    reload();
  };

  const cancelRncById = (id: number) => {
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <IconButton color="primary" aria-label="add to shopping cart" onClick={handleClickOptions}>
        <FontAwesomeIcon icon="ellipsis-vertical" color="#e6b200" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openOptions}
        onClose={handleCloseOptions}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem disabled={!canAccessFillingPage({ rnc, userId, userRole })} onClick={() => goToPage(`/rnc/new/${rnc.id}`)}>
          Preenchimento
        </MenuItem>
        <MenuItem disabled={!canAccessDetailingInfo({ rnc, userId, userRole })} onClick={() => goToPage(`/rnc/new/${rnc.id}`)}>
          Detalhamento
        </MenuItem>
        <MenuItem disabled={!canAccessInvestigationPage({ rnc, userId, userRole })} onClick={() => goToPage(`/rnc/general/${rnc.id}`)}>
          Investigação
        </MenuItem>
        <MenuItem disabled={!canAccessElaborationPage({ rnc, userId, userRole })} onClick={() => goToPage(`/rnc/general/${rnc.id}`)}>
          Plano de Ação
        </MenuItem>
        <MenuItem disabled={!canAccessExecutionPage({ rnc, userRole })} onClick={() => goToPage(`/rnc/general/implementacao/${rnc.id}`)}>
          Verificação Implementação
        </MenuItem>
        <MenuItem
          disabled={!canAccessVerificationPage({ rnc, userRole })}
          onClick={() => goToPage(`/rnc/general/implementacao/validacao/${rnc.id}`)}
        >
          Verificação Eficácia
        </MenuItem>
        <MenuItem
          disabled={!canAccessValidationPage({ rnc, userRole })}
          onClick={() => goToPage(`/rnc/general/implementacao/fechamento/${rnc.id}`)}
        >
          Fechamento
        </MenuItem>
        <MenuItem
          disabled={!canAccessRncCancelButton({ rnc, userId, userRole })}
          onClick={() => cancelRncById(rnc.id)}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Cancelar
          <FontAwesomeIcon icon="cancel" className="ms-2" color="#ff0000" />
        </MenuItem>
        <MenuItem
          disabled={!canAccessRncDeleteButton({ rnc, userId, userRole })}
          onClick={() => deleteRncById(rnc.id)}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Excluir
          <FontAwesomeIcon icon="trash" className="ms-2" color="#ff0000" />
        </MenuItem>
      </Menu>
      <Dialog open={isConfirmationOpen} fullWidth maxWidth="lg">
        <DialogTitle>Confirmar cancelamento</DialogTitle>
        <DialogContent sx={{ margin: 1 }}>
          <TextField
            label="Justificativa"
            maxRows={5}
            multiline
            placeholder="Justificativa"
            onChange={event => setReason(event.target.value)}
            sx={{ width: '100%' }}
            value={reason}
          />
        </DialogContent>
        <DialogActions>
          <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
            <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => setIsConfirmationOpen(false)}>
              Voltar
            </Button>

            <Button
              type="submit"
              onClick={() => cancel(rnc.id)}
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
            >
              Confirmar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MenuOptions;
