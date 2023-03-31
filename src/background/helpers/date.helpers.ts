export const getHoursDiffBetweenTwoDates = (date1: Date, date2: Date): number => (
  Math.abs(date1.getTime() - date2.getTime()) / (60 * 60 * 1000));
