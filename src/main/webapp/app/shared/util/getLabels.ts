export function getLabelGrauRO(letter: string) {
  const levels = {
    A: 'ALTO',
    B: 'BAIXO',
    M: 'MÉDIO',
  };
  return levels[letter] || 'N/A';
}
