import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import './ButtonList.scss';
import { useEffect, useState, useCallback } from 'react';
import { getActiveRoutes, RouteVM } from 'app/shared/services/gateway.service';
import { Tooltip } from '@mui/material';

const ButtonList = () => {
  const navigate = useNavigate();
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveServices = useCallback(async () => {
    try {
      const routes = await getActiveRoutes();
      const services = routes
        .filter(route => route.serviceInstances.some(instance => instance.instanceInfo.status === 'UP'))
        .map(route => route.serviceId.toLowerCase());

      // Compara com o estado anterior para evitar re-renders desnecessários
      setActiveServices(prevServices => {
        const hasChanges =
          services.length !== prevServices.length ||
          services.some(service => !prevServices.includes(service)) ||
          prevServices.some(service => !services.includes(service));

        return hasChanges ? services : prevServices;
      });
    } catch (error) {
      console.error('Error fetching active services:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Busca inicial
    fetchActiveServices();

    // Polling a cada 5 segundos para verificar mudanças
    const interval = setInterval(fetchActiveServices, 5000);

    // Cleanup ao desmontar o componente
    return () => clearInterval(interval);
  }, [fetchActiveServices]);

  const isServiceActive = useCallback(
    (serviceId: string) => {
      return activeServices.includes(serviceId.toLowerCase());
    },
    [activeServices]
  );

  const buttons = [
    { icon: <FontAwesomeIcon icon="calendar-check" />, link: 'goals/', legenda: 'Objetivos e Metas', serviceId: 'all4qmsmsgoals' },
    { icon: <FontAwesomeIcon icon="file-lines" />, link: '/infodoc', legenda: 'Informação Documentada', serviceId: 'all4qmsmsinfodoc' },
    {
      icon: <FontAwesomeIcon icon="crosshairs" />,
      link: '/risks-opportunities',
      legenda: 'Riscos e Oportunidades',
      serviceId: 'all4qmsmsrisco',
    },
    { icon: <FontAwesomeIcon icon="location-crosshairs" />, link: '/audit?tab=0', legenda: 'Auditorias', serviceId: 'all4qmsmsauditplan' },
    { icon: <FontAwesomeIcon icon="file-circle-check" />, link: '/rnc', legenda: 'RNC / OM', serviceId: 'all4qmsmsrnc' },
    {
      icon: <FontAwesomeIcon icon="file-circle-exclamation" />,
      link: '/performance-indicators',
      legenda: 'Indicadores de Desempenho',
      serviceId: 'all4qmsmsmetaind',
    },
    {
      icon: <FontAwesomeIcon icon="chart-line" />,
      link: '/strategic-planning',
      legenda: 'Planejamento Estratégico',
      serviceId: 'all4qmsmsstrategic',
    },
  ];

  return (
    <div className="button-list">
      {buttons.map((button, index) => {
        const isActive = isServiceActive(button.serviceId);
        return (
          <div key={index} className="container">
            <Tooltip title={isLoading ? 'Verificando status...' : isActive ? 'Serviço ativo' : 'Serviço indisponível'} placement="top">
              <a
                className={!isActive ? 'button-disabled' : 'button'}
                onClick={() => isActive && navigate(button.link)}
                style={{ cursor: isActive ? 'pointer' : 'not-allowed' }}
              >
                {button.icon}
              </a>
            </Tooltip>
            <span>{button.legenda}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ButtonList;
