import { calculateTimeLeft } from 'helpers/time.helpers';
import { useEffect, useState } from 'react';

interface ITime {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

export interface IUseTimerDTO {
  endsAt: string | Date
  updateInfo?: () => void
  isMobile?: boolean
}

interface CounterProps {
  onTimeEnd?: () => void,
  date: Date | null,
}

export const useCountdown = ({ date, onTimeEnd }: CounterProps): ITime => {
  const [timeLeft, setTimeLeft] = useState<ITime>(date
    ? () => calculateTimeLeft(date) : {
      days: 0, hours: 0, seconds: 0, minutes: 0,
    });

  useEffect(() => {
    if (date && !timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds && onTimeEnd && date > new Date()) {
      onTimeEnd();
    }
  }, [timeLeft]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (date) {
        setTimeLeft(calculateTimeLeft(date));
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

  return {
    days: timeLeft.days,
    hours: timeLeft.hours,
    minutes: timeLeft.minutes,
    seconds: timeLeft.seconds,
  };
};
