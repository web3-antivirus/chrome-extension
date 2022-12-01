/* eslint-disable camelcase */
import {
  FC, memo, useState,
} from 'react';
import cn from 'classnames';

import alertIcon from 'assets/images/icons/alert.svg';
import checkIcon from 'assets/images/icons/check-circle.svg';
import copyIcon from 'assets/images/icons/copy.svg';
import { getImageUrl } from 'helpers/image.helpers';
import Popup from 'components/Popup';
import Button from 'components/Button';
import { RisksProps } from 'types/fetch.type';
import { useUserId } from 'hooks/use-user-id';
import { roundNumber } from 'helpers/big-number.helpers';

import RiskBlocks from './RiskBlocks';
import ContractInfo from './ContractInfo';
import styles from './styles.module.scss';
import SuspiciousActivity from './SuspiciousActivity';
import Suspicious from './Suspicious';

type Props = RisksProps & {
  address: string;
  handleProceed: (val: boolean, userId: string) => void;
  handleDecline: (userId: string) => void;
};

const ContractRisks: FC<Props> = ({
  address,
  contract,
  collection, statistic,
  handleProceed, handleDecline,
}) => {
  const [isOpenCopyPopup, setIsOpenCopyPopup] = useState(false);
  const [isOpenSuspicious, setIsOpenSuspicious] = useState(false);
  const userId = useUserId();

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setIsOpenCopyPopup(true);
    setTimeout(() => setIsOpenCopyPopup(false), 1000);
  };

  return (
    <div className={styles.wrapper}>
      {isOpenSuspicious ? <SuspiciousActivity data={contract?.analysis} handleClose={() => setIsOpenSuspicious(false)} />
        : (
          <>
            <div className={styles.contract}>
              <p className={styles.contractTitle}>
                Contract
                <img src={getImageUrl(contract?.analysis.verified ? checkIcon : alertIcon)} alt="" className={styles.check} />
              </p>
              <p className={styles.address}>
                {address}
                <Popup
                  styleType="tooltip"
                  content={<p>Copied!</p>}
                  open={isOpenCopyPopup}
                  position="bottom center"
                  trigger={(
                    <button onClick={copyAddress} className={styles.copyBtn}>
                      <img src={getImageUrl(copyIcon)} alt="copy" />
                    </button>
                  )}
                />
              </p>
            </div>
            {collection && (
              <ContractInfo
                collection={collection}
                statistic={statistic}
                contractCreatedAt={contract?.createdAt}
              />
            )}
            <div className={styles.percents}>
              <p
                className={cn(styles.score, {
                  [styles.low]: contract?.analysis?.risk < 40,
                  [styles.medium]: contract?.analysis?.risk > 40 && contract?.analysis?.risk < 70,
                  [styles.high]: contract?.analysis?.risk >= 70,
                })}
              >
                {roundNumber(contract?.analysis?.risk || 0)}%
              </p>
              <p className={styles.textScore}>Overall risk score</p>
            </div>
            <div className={styles.risks}>
              <p className={styles.riskTitle}>Technical risks</p>
              <RiskBlocks {...contract?.analysis?.code?.service2?.detectors || {}} />
            </div>
            <Suspicious data={contract?.analysis} handleOpen={() => setIsOpenSuspicious(true)} />
          </>
        )}
      <div className={styles.footer}>
        <p className={styles.footerText}>What would you like to do?</p>
        <div className={styles.buttons}>
          <Button onClick={() => handleDecline(userId)} styleType="green" className={styles.button}>
            Decline
          </Button>
          <Button
            onClick={() => handleProceed(contract?.analysis.code.service2.risk < 60, userId)}
            styleType="gray"
            className={styles.button}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ContractRisks);
