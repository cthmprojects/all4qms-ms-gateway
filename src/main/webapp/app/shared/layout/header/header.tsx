import './header.scss';

import React, { useState } from 'react';

import { Navbar, Nav, NavbarToggler } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Brand } from './header-components';
import { IconButton, Menu } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Badge from '@mui/material/Badge';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { logout } from 'app/shared/reducers/authentication';
import MenuItem from '@mui/material/MenuItem';
import { Build } from '@mui/icons-material';
import { Storage } from 'react-jhipster';

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
  const [anchorAdm, setAnchorAdm] = React.useState(null);
  const [anchorUser, setAnchorUser] = React.useState(null);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);

  const userMenuOpen = Boolean(anchorEl);
  const admMenuOpen = Boolean(anchorAdm);
  const profileMenuOpen = Boolean(anchorUser);

  const navigate = useNavigate();

  const handleOpenAdmMenu = event => {
    setAnchorAdm(event.currentTarget);
  };

  const handleCloseAdmMenu = () => {
    setAnchorAdm(null);
  };

  const handleOpenProfileMenu = event => {
    setAnchorUser(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorUser(null);
  };

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
              {props.isAuthenticated && props.isAdmin ? (
                <>
                  <IconButton onClick={handleOpenAdmMenu} sx={{ marginRight: '13px' }}>
                    <Build />
                  </IconButton>
                  <Menu open={admMenuOpen} anchorEl={anchorAdm} onClose={handleCloseAdmMenu}>
                    <MenuItem>
                      <Link to={'/admin/gateway'} target="_blank">
                        Gateway
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/admin/user-management'} target="_blank">
                        Gerenciamento de usuário
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/admin/metrics'} target="_blank">
                        Métricas
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/admin/health'} target="_blank">
                        Estado do Sistema
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/admin/configuration'} target="_blank">
                        Configuração
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/admin/logs'} target="_blank">
                        Logs
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={'/admin/docs'} target="_blank">
                        Swagger
                      </Link>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <></>
              )}
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
                <MenuItem onClick={() => navigate('/account/reset/finish')}>Alterar senha</MenuItem>
              </Menu>
              <Button startIcon={<AccountCircleIcon />} className="remove-margin-top-icon" onClick={handleOpenProfileMenu}>
                {Storage.session.get('firstName')}
              </Button>
              <Menu open={profileMenuOpen} anchorEl={anchorUser} onClose={handleCloseProfileMenu}>
                <MenuItem onClick={() => navigate('/account/reset/finish')}>Trocar senha</MenuItem>
                <MenuItem onClick={() => navigate('/logout')}>Sair</MenuItem>
              </Menu>

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
