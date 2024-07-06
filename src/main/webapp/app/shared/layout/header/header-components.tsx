import React from 'react';

import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuItem } from '@mui/material';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/Camada_1.svg" alt="Logo" />
  </div>
);

export const Brand = () => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
  </NavbarBrand>
);

export const Home = () => (
  <NavItem>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <span>Início</span>
      <FontAwesomeIcon icon="home" />
    </NavLink>
  </NavItem>
);

export const MenuItensSettings = ({ admMenuOpen, anchorAdm, handleCloseAdmMenu, listMenuItens }) => (
  <Menu open={admMenuOpen} anchorEl={anchorAdm} onClose={handleCloseAdmMenu}>
    {listMenuItens.map((item, index) => (
      <MenuItem key={index}>
        <Link to={item.navigate} target="_blank">
          {item.name}
        </Link>
      </MenuItem>
    ))}
  </Menu>
);

export const MenuItensPendencias = ({ notifyMenuOpen, anchorNotify, handleCloseMenu, pendenciasList, navigate }) => {
  return (
    <Menu open={notifyMenuOpen} anchorEl={anchorNotify} onClose={handleCloseMenu}>
      {pendenciasList.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            handleCloseMenu();
            navigate(`pendencia/${item.id}`);
          }}
        >
          {item.nome}
        </MenuItem>
      ))}
    </Menu>
  );
};
