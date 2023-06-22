import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavDropdown } from './menu-components';

const adminMenuItems = () => (
  <>
    <MenuItem icon="road" to="/admin/gateway">
      Gateway
    </MenuItem>
    <MenuItem icon="users" to="/admin/user-management">
      Gerenciamento de usuário
    </MenuItem>
    <MenuItem icon="tachometer-alt" to="/admin/metrics">
      Métricas
    </MenuItem>
    <MenuItem icon="heart" to="/admin/health">
      Estado do Sistema
    </MenuItem>
    <MenuItem icon="cogs" to="/admin/configuration">
      Configuração
    </MenuItem>
    <MenuItem icon="tasks" to="/admin/logs">
      Logs
    </MenuItem>
    {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
  </>
);

const openAPIItem = () => (
  <MenuItem icon="book" to="/admin/docs">
    API
  </MenuItem>
);

export const AdminMenu = ({ showOpenAPI }) => (
  <NavDropdown icon="users-cog" name="Administração" id="admin-menu" data-cy="adminMenu">
    {adminMenuItems()}
    {showOpenAPI && openAPIItem()}
  </NavDropdown>
);

export default AdminMenu;
