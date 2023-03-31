const RATIO_WITH_RISKS = 0.5;
export const hasCollectionRisks = (days: number, transactionsCount: number): boolean => {
  const ratio = 1.15 - (0.5 * (days / 600) + 0.5 * (transactionsCount / 8000));
  return ratio >= RATIO_WITH_RISKS;
};
