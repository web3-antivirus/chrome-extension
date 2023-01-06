import {
  FC, memo, useMemo,
} from 'react';

import { RISK_TYPE } from 'constants/risks.constants';
import { getRiskTypeFromRisk } from 'helpers/analyze.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import alertIcon from 'assets/images/icons/danger.svg';

import { separateAddress } from '../../../../../helpers/address.helpers';
import { fromWeiWithoutFormat } from '../../../../../helpers/big-number.helpers';
import { getEtherscanAddressUrl } from '../../../../../helpers/url.helpers';
import styles from './styles.module.scss';

type Props = {
  address: string
  value: string
  risk: number
};

const TracingTransferBlock: FC<Props> = ({
  address, value, risk,
}) => {
  const hasRisk = useMemo(() => getRiskTypeFromRisk(risk) !== RISK_TYPE.LOW, [risk]);

  return (
    <div className={styles.tracingBlock}>
      <div className={styles.tracingInformation}>
        <p><span className={styles.bold}>Transfer ETH</span></p>
        <p className={styles.address}>
          Address:
          {hasRisk && <img className={styles.alertIcon} src={getImageUrl(alertIcon)} alt="" /> }
          <a href={getEtherscanAddressUrl(address)} target="_blank" rel="noreferrer" className={styles.link}>
            {separateAddress(address)}
          </a>
        </p>
        <p>
          <span className={styles.bold}>
            {fromWeiWithoutFormat(parseInt(value ?? '0x0', 16), 18)} ETH
          </span>
        </p>
      </div>
    </div>
  );
};

export default memo(TracingTransferBlock);
