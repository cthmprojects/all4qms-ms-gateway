import './header.scss';

import React, { useEffect, useState } from 'react';

import { Navbar, Nav, NavbarToggler } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Brand, MenuItensSettings } from './header-components';
import { IconButton, Menu } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotifyIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Badge from '@mui/material/Badge';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { logout } from 'app/shared/reducers/authentication';
import MenuItem from '@mui/material/MenuItem';
import { Build } from '@mui/icons-material';
import { Storage } from 'react-jhipster';
import { IPendencia } from '../../model/pendencia.model';
import { getEntitiesById } from '../../../entities/pendencia/pendencia.reducer';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
}
const menuItensSettings = [
  {
    name: 'Gateway',
    navigate: '/admin/gateway',
  },
  {
    name: 'Gerenciamento de usuário',
    navigate: '/admin/user-management',
  },
  {
    name: 'Métricas',
    navigate: '/admin/metrics',
  },
  {
    name: 'Estado do Sistema',
    navigate: '/admin/health',
  },
  {
    name: 'Configuração',
    navigate: '/admin/configuration',
  },
  {
    name: 'Logs',
    navigate: '/admin/logs',
  },
  {
    name: 'Swagger',
    navigate: '/admin/docs',
  },
];
const Header = (props: IHeaderProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorAdm, setAnchorAdm] = React.useState(null);
  const [anchorUser, setAnchorUser] = React.useState(null);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const pendenciaList: IPendencia[] = useAppSelector(state => state?.all4qmsmsgateway?.pendencia?.entities);
  // const totalItems = useAppSelector(state => state.all4qmsmsgateway.pendencia.totalItems);
  // const totalItems = useAppSelector(state => state.all4qmsmsgateway.pendencia.totalItems);

  const getAllEntities = async () => {
    const pendencias = await dispatch(
      getEntitiesById({
        page: 1,
        size: 10,
        sort: `id,desc`,
        idUser: Storage.session.get('ID_USUARIO'),
      })
    );
    console.log('pendencias ->', await pendencias);
    console.log('pendenciaList ->', pendenciaList);
  };
  useEffect(() => {
    console.log('useEffect disparado. isAuthenticated ->', isAuthenticated);
    (async () => {
      try {
        const token = await Storage.session.get('jhi-authenticationToken');
        console.log('Executando useEffect token', token);
        getAllEntities();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [isAuthenticated]);
  // const sortEntities = () => {
  //   getAllEntities();
  //   const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
  //   if (location.search !== endURL) {
  //     navigate(`${location.pathname}${endURL}`);
  //   }
  // };
  const userMenuOpen = Boolean(anchorEl);
  const admMenuOpen = Boolean(anchorAdm);
  const profileMenuOpen = Boolean(anchorUser);

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
                  <MenuItensSettings
                    admMenuOpen={admMenuOpen}
                    anchorAdm={anchorAdm}
                    handleCloseAdmMenu={handleCloseAdmMenu}
                    listMenuItens={menuItensSettings}
                  />
                </>
              ) : (
                <></>
              )}
              <Badge badgeContent={0} color="primary" sx={{ marginRight: '13px' }}>
                <NotifyIcon color="action" />
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
