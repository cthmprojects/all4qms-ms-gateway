import React from 'react';
import './ButtonList.scss';
import { Icon } from '@iconify/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const ButtonList = () => {
  const navigate = useNavigate();

  const buttons = [
    { icon: <FontAwesomeIcon icon="calendar-check" />, link: 'goals/', legenda: 'Objetivos e Metas', disabled: false },
    { icon: <FontAwesomeIcon icon="file-lines" />, link: '/infodoc', legenda: 'Informação Documentada' },
    { icon: <FontAwesomeIcon icon="crosshairs" />, link: '/risks-opportunities', legenda: 'Riscos e Oportunidades' },
    { icon: <FontAwesomeIcon icon="location-crosshairs" />, link: '', legenda: 'Auditorias', disabled: true },
    { icon: <FontAwesomeIcon icon="file-circle-check" />, link: '/rnc', legenda: 'RNC / OM' },
    { icon: <FontAwesomeIcon icon="file-circle-exclamation" />, link: '', legenda: 'Indicadores de Desempenho', disabled: true },
    { icon: <FontAwesomeIcon icon="chart-line" />, link: '', legenda: 'Análise Crítica', disabled: true },
  ];

  return (
    <div className="button-list">
      {buttons.map((button, index) => (
        // eslint-disable-next-line react/jsx-key
        <div key={index} className="container">
          <a className={button.disabled ? 'button-disabled' : 'button'} onClick={() => navigate(button.link)} aria-disabled>
            {button.icon}
          </a>
          <span>{button.legenda}</span>
        </div>
      ))}
    </div>
  );
};

export default ButtonList;
