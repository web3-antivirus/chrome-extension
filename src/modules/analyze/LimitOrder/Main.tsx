import { FC } from 'react';
import oneInchLogo from 'assets/images/one-inch-logo.svg';

import { CloseIcon } from 'constants/icons.constants';
import { getImageUrl } from 'helpers/image.helpers';
import HighlightsAlerts from 'components/HighlightsAlerts';
import ContractSummary from 'components/ContractSummary';
import checkIcon from 'assets/images/icons/check-circle.svg';
import TopInfo from 'layouts/TopInfo';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import MainInfo from 'layouts/MainInfo';
import { SECURITY_LEVEL } from 'interfaces/analyze.interfaces';
import styles from './styles.module.scss';
import { IHighlightAlert, ProtocolRisks } from '../Scan/ScanningResult/interfaces';

interface Props {
  alerts: IHighlightAlert[];
  onContractClick: () => void;
  contractData: ProtocolRisks
}

const Main: FC<Props> = ({ alerts, onContractClick, contractData }) => (
  <>
    <TopInfo className={styles.header}>
      <div className={styles.title}>
        <span>Limit order</span>
        <CloseIcon classNames={styles.closeIcon} />
        <img src={getImageUrl(oneInchLogo)} alt="1inch" />
      </div>
      <div className={styles.message}>
        When the market price matches the price set in the limit order, a taker can fill it,
        covering the gas cost in addition to the trade&apos;s value.
      </div>
    </TopInfo>
    <MainInfo className={styles.main}>
      <div className={styles.contractData}>
        <div className={styles.title}>Receive</div>
        <ContractSummary
          name={contractData.name}
          label={contractData.label}
          risksCount={contractData.risksCount}
          iconSrc={getImageUrl(
            ((!contractData.risksCount
               && contractData.contract?.verified) || contractData.contract?.contract?.securityLevel === SECURITY_LEVEL.WHITELIST)
              ? checkIcon : alertIcon,
          )}
          onClick={onContractClick}
        />
      </div>
      <HighlightsAlerts alerts={alerts} />
    </MainInfo>
  </>
);

export default Main;
