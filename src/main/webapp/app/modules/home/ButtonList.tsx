import React from 'react';
import './ButtonList.scss';
import { Icon } from '@iconify/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonList = () => {
  const buttons = [
    { icon: <FontAwesomeIcon icon="calendar-check" />, link: '', legenda: 'Objetivos e Metas', disabled: true },
    { icon: <FontAwesomeIcon icon="file-lines" />, link: '', legenda: 'Informações documentadas', disabled: true },
    { icon: <FontAwesomeIcon icon="crosshairs" />, link: '', legenda: 'Riscos e Oportunidades', disabled: true },
    { icon: <FontAwesomeIcon icon="location-crosshairs" />, link: '', legenda: 'Auditorias', disabled: true },
    { icon: <FontAwesomeIcon icon="file-circle-check" />, link: '/rnc', legenda: 'RNC / OM' },
    { icon: <FontAwesomeIcon icon="file-circle-exclamation" />, link: '', legenda: 'Indicadores de desempenho', disabled: true },
    { icon: <FontAwesomeIcon icon="chart-line" />, link: '', legenda: 'Análise crítica', disabled: true },
  ];

  return (
    <div className="button-list">
      {buttons.map((button, index) => (
        // eslint-disable-next-line react/jsx-key
        <div className="container">
          <a key={index} className={button.disabled ? 'button-disabled' : 'button'} href={button.link} aria-disabled>
            {button.icon}
          </a>
          <span>{button.legenda}</span>
        </div>
      ))}
    </div>
  );
};

export default ButtonList;
