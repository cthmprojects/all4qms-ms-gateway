const FUTURE_YEARS_OFFSET = 5;
const PAST_YEARS_OFFSET = 5;

export const getYearRange = (): Array<number> => {
  const now: Date = new Date();
  const currentYear: number = now.getFullYear();

  const allYears: Array<number> = [];

  for (let year = currentYear - PAST_YEARS_OFFSET; year <= currentYear + FUTURE_YEARS_OFFSET; year++) {
    allYears.push(year);
  }

  return allYears;
};
