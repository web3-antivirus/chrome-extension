import { format } from 'date-fns';

import { DATE_FORMAT } from 'constants/global.constants';

type calculateTimeLeftFunc = (date: Date) => ({
  days: number,
  hours: number,
  minutes: number,
  seconds: number
})

export const calculateTimeLeft: calculateTimeLeftFunc = (date) => {
  const difference = +new Date(date) - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const addMinutesToDate = (date: Date, minutes: number): Date => new Date(date.getTime() + minutes * 60 * 1000);

export const getDateWithFormat = (date?: number | string | Date, dateFormat = DATE_FORMAT.DATE_TIME_NUMBER): string | null => {
  if (!date) return null;

  return format(new Date(date), dateFormat);
};
