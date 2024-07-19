import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
// import { deleteEntity as deleteRNCUser } from './usuario.reducer';
// import { deleteEntity as deletePendencia } from './pendencia.reducer';
// import { deleteUser as deleteJhipsterUser } from 'app/modules/administration/user-management/user-management.reducer';

export const PendenciaOptions = ({ userRole, pendencia, deletePendencia, setIdPendenciaSelect, setIsOpenModal }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const openOptions = Boolean(anchorEl);

  const handleClickOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleDeletePend = (loginJhUser: any, idRncUser: any) => {
  //   deletePendencia(loginJhUser, idRncUser);
  // };

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
        <MenuItem
          onClick={() => {
            setIsOpenModal(true);
            setIdPendenciaSelect(pendencia.id);
          }}
        >
          Visualizar
        </MenuItem>
        {userRole.includes('ROLE_ADMIN') && (
          <>
            {/* <MenuItem onClick={() => navigate(`${pendencia.id}/edit`)}>Editar</MenuItem> */}
            <MenuItem onClick={() => navigate(`${pendencia.id}/delete`)}>
              Deletar
              <FontAwesomeIcon icon="trash" className="ms-2" color="#ff0000" />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};
