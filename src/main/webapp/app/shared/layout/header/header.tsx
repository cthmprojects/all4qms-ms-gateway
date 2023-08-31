import './header.scss';

import React, { useEffect, useState } from 'react';

import { Navbar, Nav, NavbarToggler, Collapse, Alert } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Home, Brand } from './header-components';
import { AdminMenu, EntitiesMenu, AccountMenu } from '../menus';
import { IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '../menus/menu-item';
import Badge from '@mui/material/Badge';
import { Navigate, useLocation } from 'react-router-dom';
import { logout } from 'app/shared/reducers/authentication';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">Development</a>
      </div>
    ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const goToLogin = () => {
    const { from } = (location.state as any) || { from: { pathname: '/login', search: location.search } };
    return <Navigate to={from} replace />;
  };

  const _logout = () => {
    dispatch(logout());
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
    goToLogin();
    window.location.reload();
  };

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */
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
              <IconButton>
                <SettingsIcon />
              </IconButton>
              <Button startIcon={<AccountCircleIcon />} className="remove-margin-top-icon">
                Usuário
              </Button>
              <IconButton onClick={() => _logout()}>
                <LogoutIcon />
              </IconButton>
            </Nav>
            {/* <Collapse isOpen={menuOpen} navbar>
              <Nav id="header-tabs" className="ms-auto" navbar>
                <Home />
                {props.isAuthenticated && <EntitiesMenu />}
                {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
                <AccountMenu isAuthenticated={props.isAuthenticated} />
              </Nav>
            </Collapse> */}
          </Navbar>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
