import './general-list.scss';

import React, { useEffect, useState } from 'react';

import { Navbar, Nav, NavbarToggler, Collapse, Alert, Row } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Home, Brand } from '../header/header-components';
import { AdminMenu, EntitiesMenu, AccountMenu } from '../menus';
import {
  Breadcrumbs,
  Divider,
  IconButton,
  Menu,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Badge from '@mui/material/Badge';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const columns = ['Dessert (100g serving)', 'Calories', 'Fat', 'Carbs', 'Protein'];

  const rows = [
    ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
    ['Cupcake', 305, 3.7, 67, 4.3],
    ['Gingerbread', 356, 16.0, 49, 3.9],
  ];

  const renderTable = () => {
    if (columns.length > 0 && rows.length > 0) {
      return (
        <>
          <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell align="left">{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow>
                    {row.map(item => (
                      <TableCell>{item}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Row className="justify-content-center mt-5">
            <Pagination count={10} style={{ width: '370px' }} />
          </Row>
        </>
      );
    } else {
      return (
        <Row className="justify-content-center mt-5">
          <span style={{ color: '#7d7d7d' }}>Nenhum item encontrado.</span>
        </Row>
      );
    }
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }} to={'/'}>
            Home
          </Link>
          <Typography className="link">Usuários</Typography>
        </Breadcrumbs>
        <h1 className="title">Usuários</h1>
        <div style={{ paddingBottom: '30px' }}>
          <Button variant="contained" className="primary-button" style={{ marginRight: '10px' }} onClick={() => navigate('/usuario/new')}>
            CADASTRAR
          </Button>
          <Button variant="contained" className="update-button">
            ATUALIZAR
          </Button>
        </div>
        <Divider sx={{ borderColor: '#7d7d7d' }}></Divider>
        {renderTable()}
      </div>
    </div>
  );
};

export default GeneralList;
