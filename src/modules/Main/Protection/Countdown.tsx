import { FC } from 'react';
import { useCountdown } from 'hooks/use-countdown';
import styles from './styles.module.scss';

interface Props {
  date: string
  onTimeEnd: () => void
}

const Countdown: FC<Props> = ({ date, onTimeEnd }) => {
  const { minutes, seconds } = useCountdown({ date: new Date(date), onTimeEnd });
  return (
    <div className={styles.countdown}>
      W3A will resume in <span className={styles.time}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
    </div>
  );
};

export default Countdown;
