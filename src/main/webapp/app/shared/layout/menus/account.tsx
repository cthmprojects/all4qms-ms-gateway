import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import { NavDropdown } from './menu-components';

const accountMenuItemsAuthenticated = () => (
  <>
    <MenuItem icon="wrench" to="/account/settings" data-cy="settings">
      Configuração
    </MenuItem>
    <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
      Senha
    </MenuItem>
    <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
      Sair
    </MenuItem>
  </>
);

const accountMenuItems = () => (
  <>
    <MenuItem id="login-item" icon="sign-in-alt" to="/login" data-cy="login">
      Entrar
    </MenuItem>
    <MenuItem icon="user-plus" to="/account/register" data-cy="register">
      Criar uma conta
    </MenuItem>
  </>
);

export const AccountMenu = ({ isAuthenticated = false }) => (
  <NavDropdown icon="user" name="Conta" id="account-menu" data-cy="accountMenu">
    {isAuthenticated ? accountMenuItemsAuthenticated() : accountMenuItems()}
  </NavDropdown>
);

export default AccountMenu;
