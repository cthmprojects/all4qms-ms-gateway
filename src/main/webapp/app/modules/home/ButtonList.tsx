import React from 'react';
import './ButtonList.scss';
import { Icon } from '@iconify/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonList = () => {
  const buttons = [
    { icon: <FontAwesomeIcon icon="calendar-check" />, link: '/pagina1', legenda: 'Objetivos e Metas' },
    { icon: <FontAwesomeIcon icon="file-lines" />, link: '/infodoc', legenda: 'Informações documentadas' },
    { icon: <FontAwesomeIcon icon="crosshairs" />, link: '/pagina3', legenda: 'Riscos e Oportunidades' },
    { icon: <FontAwesomeIcon icon="location-crosshairs" />, link: '/pagina3', legenda: 'Auditorias' },
    { icon: <FontAwesomeIcon icon="file-circle-check" />, link: '/rnc', legenda: 'RNC / OM' },
    { icon: <FontAwesomeIcon icon="file-circle-exclamation" />, link: '/pagina3', legenda: 'Indicadores de desempenho' },
    { icon: <FontAwesomeIcon icon="chart-line" />, link: '/pagina3', legenda: 'Análise crítica' },
  ];

  return (
    <div className="button-list">
      {buttons.map((button, index) => (
        // eslint-disable-next-line react/jsx-key
        <div className="container">
          <a key={index} className="button" href={button.link}>
            {/* <Icon icon={button.icon} className="icon" /> */}
            {button.icon}
          </a>
          <span>{button.legenda}</span>
        </div>
      ))}
    </div>
  );
};

export default ButtonList;
