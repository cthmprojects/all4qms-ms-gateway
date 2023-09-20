import './header.scss';

import React, { useEffect, useState } from 'react';

import { Navbar, Nav, NavbarToggler, Collapse, Alert } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Home, Brand } from './header-components';
import { AdminMenu, EntitiesMenu, AccountMenu } from '../menus';
import { IconButton, Menu } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Badge from '@mui/material/Badge';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { logout } from 'app/shared/reducers/authentication';
import MenuItem from '@mui/material/MenuItem';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);

  const userMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpenUserMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">Development</a>
      </div>
    ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const account = useAppSelector(state => state.authentication.account);

  return (
    <>
      {props.isAuthenticated ? (
        <div id="app-header">
          <LoadingBar className="loading-bar" />
          <Navbar data-cy="navbar" dark expand="md" className="bg-primary">
            <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
            <Brand />
            <Nav id="header-tabs" className="ms-auto" navbar>
              <Badge badgeContent={4} color="primary" sx={{ marginRight: '13px' }}>
                <MailIcon color="action" />
              </Badge>
              <IconButton onClick={handleOpenUserMenu}>
                <SettingsIcon />
              </IconButton>
              <Menu open={userMenuOpen} anchorEl={anchorEl} onClose={handleCloseUserMenu}>
                <MenuItem onClick={() => navigate('/usuario')}>Usuários</MenuItem>
                <MenuItem onClick={() => navigate('/funcao')}>Funções</MenuItem>
                <MenuItem onClick={() => navigate('/setor')}>Setores</MenuItem>
                <MenuItem onClick={() => navigate('/processo')}>Processos</MenuItem>
                <MenuItem onClick={() => navigate('/pendencia')}>Pendências</MenuItem>
              </Menu>
              <Button startIcon={<AccountCircleIcon />} className="remove-margin-top-icon">
                Usuário
              </Button>
              <IconButton onClick={() => navigate('/logout')}>
                <LogoutIcon />
              </IconButton>
            </Nav>
          </Navbar>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
