import { FC, memo } from 'react';
import TracingContent from './Tracing';
import FooterButtons from '../../../../components/FooterButtons';
import { Contract, TraceWithRisk } from '../../../../types/fetch.type';
import { useUserId } from '../../../../hooks/use-user-id';
import { getImageUrl } from '../../../../helpers/image.helpers';
import arrowLeftIcon from '../../../../assets/images/icons/arrow-green-left.svg';
import styles from './styles.module.scss';

type Props = {
  contract: Contract,
  trace: TraceWithRisk[],
  handleProceed: (val: boolean, userId: string) => void;
  handleDecline: (userId: string) => void;
  setScanScreen: (scanScreen: number) => void;
};

const Tracing: FC<Props> = ({
  contract, handleProceed, handleDecline, setScanScreen, trace,
}) => {
  const userId = useUserId();

  const handleBackClick = () => {
    setScanScreen(1);
  };

  return (
    <div className={styles.tracingWrapper}>
      <div className={styles.header}>
        <button className={styles.button} onClick={handleBackClick}><img src={getImageUrl(arrowLeftIcon)} alt="" />Back</button>
        <p className={styles.title}>Transaction simulation</p>
      </div>
      <TracingContent trace={trace} hasSimulationAlert={false} />
      <div className={styles.footer}>
        <FooterButtons
          handleDecline={() => handleDecline(userId)}
          handleProceed={() => handleProceed(contract?.analysis.code.service2.risk < 60, userId)}
          text="What would you like to do?"
        />
      </div>
    </div>
  );
};

export default memo(Tracing);
