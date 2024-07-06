import { useAppSelector } from 'app/config/store';
import ButtonList from './ButtonList';
import './home.scss';

import React from 'react';

export interface IHomeProps {
  checkAuth: () => void;
}

export const Home = (props: IHomeProps) => {
  const account = useAppSelector(state => state.authentication.account);

  props.checkAuth();

  return <ButtonList />;
};
export default Home;
