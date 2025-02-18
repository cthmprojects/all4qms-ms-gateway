import { Rnc } from 'app/modules/rnc/models';

interface props {
  rnc: Rnc;
  userId?: string | number;
  userRole: string;
}

export const canAccessFillingPage = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idEmissorNC } = rnc;
  return (userId === idEmissorNC || userRole.includes('ROLE_SGQ')) && statusAtual === 'PREENCHIMENTO';
};

export const canAccessRncDeleteButton = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idEmissorNC } = rnc;
  return (userId === idEmissorNC || userRole.includes('ROLE_SGQ')) && (statusAtual === 'PREENCHIMENTO' || statusAtual === 'DETALHAMENTO');
};

export const canAccessDetailingInfo = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idEmissorNC } = rnc;

  return (userId === idEmissorNC || userRole.includes('ROLE_SGQ')) && statusAtual === 'DETALHAMENTO';
};

export const canAccessInvestigationPage = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idReceptorNC } = rnc;
  return (userId === idReceptorNC || userRole.includes('ROLE_SGQ')) && statusAtual === 'LEVANTAMENTO';
};

export const canAccessElaborationPage = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idReceptorNC } = rnc;
  return (userId === idReceptorNC || userRole.includes('ROLE_SGQ')) && statusAtual === 'ELABORACAO';
};

export const canAccessExecutionPage = ({ rnc, userRole }: props) => {
  const { statusAtual } = rnc;
  return userRole.includes('ROLE_SGQ') && statusAtual === 'EXECUCAO';
};

export const canAccessVerificationPage = ({ rnc, userRole }: props) => {
  const { statusAtual } = rnc;
  return userRole.includes('ROLE_SGQ') && statusAtual === 'VERIFICACAO';
};

export const canAccessValidationPage = ({ rnc, userRole }: props) => {
  const { statusAtual } = rnc;
  return userRole.includes('ROLE_SGQ') && statusAtual === 'VALIDACAO';
};

export const canAccessRncCancelButton = ({ rnc, userId, userRole }: props) => {
  const { statusAtual, idEmissorNC } = rnc;
  return (
    (userId === idEmissorNC || userRole.includes('ROLE_SGQ')) &&
    statusAtual !== 'CANCELADO' &&
    statusAtual !== 'PREENCHIMENTO' &&
    statusAtual !== 'DETALHAMENTO'
  );
};
