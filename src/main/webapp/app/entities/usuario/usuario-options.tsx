import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { deleteEntity as deleteRNCUser } from './usuario.reducer';
import { deleteUser as deleteJhipsterUser } from 'app/modules/administration/user-management/user-management.reducer';

export const UsarioOptions = ({ userRole, user, deleteUser }) => {
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

  const handleDeleteUser = (loginJhUser: any, idRncUser: any) => {
    deleteUser(loginJhUser, idRncUser);
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
        <MenuItem onClick={() => navigate(`${user.id}/edit`)}>Editar usuário</MenuItem>
        {userRole.includes('ROLE_ADMIN') && (
          <MenuItem onClick={() => handleDeleteUser(user.user.login, user.id)}>
            Deletar usuário
            <FontAwesomeIcon icon="trash" className="ms-2" color="#ff0000" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
