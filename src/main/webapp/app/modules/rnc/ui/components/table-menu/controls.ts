import { Rnc } from 'app/modules/rnc/models';

interface props {
  rnc: Rnc;
  userId?: string | number;
  userRole: string;
}

export const canAccessFillingPage = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idEmissorNC } = rnc;
  return (userId === idEmissorNC && statusAtual === 'PREENCHIMENTO') || userRole === 'ROLE_SGQ';
};

export const canAccessDetailingInfo = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idEmissorNC } = rnc;

  return (userId === idEmissorNC && statusAtual === 'DETALHAMENTO') || userRole === 'ROLE_SGQ';
};

export const canAccessInvestigationPage = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idReceptorNC } = rnc;
  return (userId === idReceptorNC && statusAtual === 'LEVANTAMENTO') || userRole === 'ROLE_SGQ';
};

export const canAccessElaborationPage = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idReceptorNC } = rnc;
  return (userId === idReceptorNC && statusAtual === 'ELABORACAO') || userRole === 'ROLE_SGQ';
};

export const canAccessExecutionPage = ({ rnc, userRole }: props) => {
  const { statusAtual } = rnc;
  return userRole === 'ROLE_SGQ' && statusAtual === 'EXECUCAO';
};

export const canAccessVerificationPage = ({ rnc, userRole }: props) => {
  const { statusAtual } = rnc;
  return userRole === 'ROLE_SGQ' && statusAtual === 'VERIFICACAO';
};

export const canAccessValidationPage = ({ rnc, userRole }: props) => {
  const { statusAtual } = rnc;
  return userRole === 'ROLE_SGQ' && statusAtual === 'VALIDACAO';
};
