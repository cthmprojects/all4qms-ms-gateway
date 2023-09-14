import './general-list.scss';

import React, { useEffect, useState } from 'react';

import { Navbar, Nav, NavbarToggler, Collapse, Alert } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Home, Brand } from '../header/header-components';
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

const GeneralList = () => {
  return <></>;
};

export default GeneralList;
