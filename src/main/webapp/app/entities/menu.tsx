import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/usuario">
        Usuario
      </MenuItem>
      <MenuItem icon="asterisk" to="/funcao">
        Funcao
      </MenuItem>
      <MenuItem icon="asterisk" to="/setor">
        Setor
      </MenuItem>
      <MenuItem icon="asterisk" to="/processo">
        Processo
      </MenuItem>
      <MenuItem icon="asterisk" to="/pendencia">
        Pendencia
      </MenuItem>
      <MenuItem icon="asterisk" to="/anexo">
        Anexo
      </MenuItem>
      <MenuItem icon="asterisk" to="/parametro">
        Parametro
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
