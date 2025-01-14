import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteEntity as deleteRNCUser } from './usuario.reducer';
import { deleteUser as deleteJhipsterUser } from 'app/modules/administration/user-management/user-management.reducer';
import { hasAnyAuthority } from 'app/shared/auth/enable-component';
import { AUTHORITIES } from 'app/config/constants';
import { useConfirmDialog } from 'app/shared/hooks/useConfirmDialog';
import { resetPassword } from './user.service';

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

  let isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));

  const { ConfirmDialog, showDialog } = useConfirmDialog();

  const show = () => {
    showDialog({
      title: 'Resetar senha',
      content: 'Tem certeza que quer resetar a senha deste usuário?',
      onConfirm: () => resetPassword(user),
    });
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
        {isAdmin && <MenuItem onClick={show}>Resetar senha</MenuItem>}
        <MenuItem onClick={() => navigate(`${user.id}/edit`)}>Editar usuário</MenuItem>
        {userRole.includes('ROLE_ADMIN') && (
          <MenuItem onClick={() => handleDeleteUser(user.user.login, user.id)}>
            Deletar usuário
            <FontAwesomeIcon icon="trash" className="ms-2" color="#ff0000" />
          </MenuItem>
        )}
      </Menu>
      {ConfirmDialog}
    </>
  );
};
