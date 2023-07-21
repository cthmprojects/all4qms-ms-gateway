import React from 'react';
import './ButtonList.scss';
import { Icon } from '@iconify/react';


const ButtonList = () => {
  const buttons = [
    { icon: 'mdi:calendar-check-outline', link: '/pagina1', legenda: 'Objetivos e Metas' },
    { icon: 'mdi:file-document-edit-outline', link: '/pagina2', legenda: 'Informações documentadas' },
    { icon: 'mdi:crosshairs', link: '/pagina3', legenda: 'Riscos e Oportunidades' },
    { icon: 'mdi:file-document-check-outline', link: '/pagina3', legenda: 'Auditorias' },
    { icon: 'mdi:file-document-alert-outline', link: '/pagina3', legenda: 'RNC / OM' },
    { icon: 'mdi:chart-line', link: '/pagina3', legenda: 'Indicadores de desempenho' },
    { icon: 'mdi:file-sign', link: '/pagina3', legenda: 'Análise crítica'  },
  ];


  return (
    <div className="button-list">
      {buttons.map((button, index) => (
        <div className='container'>
          <a key={index} className="button" href={button.link}>
            <Icon icon={button.icon} className="icon"/>
          </a>
          <span>{button.legenda}</span>
        </div>
      ))}
    </div>
  );
};

export default ButtonList;
