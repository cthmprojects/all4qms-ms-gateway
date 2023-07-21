import React, { useEffect, useLayoutEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { Navigate, useLocation } from 'react-router-dom';

export const Logout = () => {
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  useLayoutEffect(() => {
    dispatch(logout());
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  });

  const goToLogin = () => {
    const { from } = (location.state as any) || { from: { pathname: '/login', search: location.search } };
    return <Navigate to={from} replace />;
  };

  return (
    <div className="p-5">
      {goToLogin()}
      <h4>Logged out successfully!</h4>
    </div>
  );
};

export default Logout;
