export const formatDateToString = (date: Date): string => {
  if (!date) {
    return '';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
};

export const filterProcess = (id: number): string => {
  if (!id) {
    return '-';
  }

  // Esta função será implementada posteriormente quando tivermos acesso ao estado global
  return id.toString();
};

export const getTipoControleText = (tipo: string): string => {
  switch (tipo) {
    case 'C':
      return 'CONTROLADA';
    case 'N':
      return 'NÃO CONTROLADA';
    default:
      return tipo || '-';
  }
};
