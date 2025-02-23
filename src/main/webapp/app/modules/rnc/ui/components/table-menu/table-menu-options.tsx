import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import { Rnc } from 'app/modules/rnc/models';
import React from 'react';
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
  const handleCloseOptions = () => {
    setAnchorEl(null);
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
    dispatch(cancelRnc(id));
    reload();
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
    </>
  );
};

export default MenuOptions;
