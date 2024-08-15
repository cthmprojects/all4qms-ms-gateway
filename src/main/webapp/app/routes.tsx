import React from 'react';
import Loadable from 'react-loadable';
import { Route } from 'react-router-dom';

import { AUTHORITIES } from 'app/config/constants';
import EntitiesRoutes from 'app/entities/routes';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import Register from 'app/modules/account/register/register';
import Login from 'app/modules/login/login';
import Logout from 'app/modules/login/logout';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { Home } from './modules/home/home';
import InfodocRoutes from './modules/infodoc';
import RisksOpportunitiesRoutes from './modules/risks-opportunities';
import RncRoutes from './modules/rnc';

const loading = <div>loading ...</div>;

export interface IRoutesProps {
  checkAuth: () => void;
}

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => loading,
});

const AppRoutes = (props: IRoutesProps) => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route
          index
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
              <Home checkAuth={props.checkAuth} />
            </PrivateRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="rnc/*" element={<RncRoutes />} />
        <Route path="infodoc/*" element={<InfodocRoutes />} />
        <Route path="risks-opportunities/*" element={<RisksOpportunitiesRoutes />} />
        <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>
        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
