import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import './ButtonList.scss';

const ButtonList = () => {
  const navigate = useNavigate();

  const buttons = [
    { icon: <FontAwesomeIcon icon="calendar-check" />, link: 'goals/', legenda: 'Objetivos e Metas', disabled: false },
    { icon: <FontAwesomeIcon icon="file-lines" />, link: '/infodoc', legenda: 'Informação Documentada' },
    { icon: <FontAwesomeIcon icon="crosshairs" />, link: '/risks-opportunities', legenda: 'Riscos e Oportunidades' },
    { icon: <FontAwesomeIcon icon="location-crosshairs" />, link: '/audit?tab=0', legenda: 'Auditorias', disabled: false },
    { icon: <FontAwesomeIcon icon="file-circle-check" />, link: '/rnc', legenda: 'RNC / OM' },
    { icon: <FontAwesomeIcon icon="file-circle-exclamation" />, link: '/performance-indicators', legenda: 'Indicadores de Desempenho' },
    { icon: <FontAwesomeIcon icon="chart-line" />, link: '/strategic-planning', legenda: 'Planejamento Estratégico' },
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
