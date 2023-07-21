import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs.ts';

import React, { useEffect } from 'react';
import { Card } from 'reactstrap';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  let isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  let isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  let ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  let isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  let isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  const checkAuth = () => {
    isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
    ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
    isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
    isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);
  };

  const paddingTop = '0px';
  return (
    <BrowserRouter basename={baseHref}>
      <div style={{ paddingTop }}>
        <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
        <ErrorBoundary>
          <Header
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            ribbonEnv={ribbonEnv}
            isInProduction={isInProduction}
            isOpenAPIEnabled={isOpenAPIEnabled}
          />
        </ErrorBoundary>
        <div id="app-view-container">
          <Card>
            <ErrorBoundary>
              <AppRoutes checkAuth={checkAuth} />
            </ErrorBoundary>
          </Card>
          <Footer isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
