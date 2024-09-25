import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';

const StrategicPlaningRoutes = () => {
  const store = getStore();

  return (
    <>
      <ErrorBoundaryRoutes>
        <Route path="" element={<>Home</>} />
        <Route path="institutional" element={<>Institucional</>} />
        <Route path="swot" element={<>SWOT</>} />
      </ErrorBoundaryRoutes>
    </>
  );
};

export default StrategicPlaningRoutes;
