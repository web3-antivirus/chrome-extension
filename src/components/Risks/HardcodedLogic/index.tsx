import Accordion from 'components/Accordion';
import { formatAddress } from 'helpers/address.helpers';
import { getEtherscanAddressUrl } from 'helpers/url.helpers';
import { FC } from 'react';
import { RiskData } from '../interfaces';
import { HardcodedLogicData } from './interfaces';
import styles from './styles.module.scss';

interface Props {
  className?: string
  risks: RiskData<HardcodedLogicData>
  isVerified?: boolean,
}

const HardcodedLogic: FC<Props> = ({ className, risks, isVerified }) => (
  <Accordion
    name="Hardcoded logic"
    risksCount={risks.count}
    className={className}
    disabled={!risks.count}
    isVerified={isVerified}
  >
    <div className={styles.wrap}>
      <div className={styles.description}>
        A hardcoded address was found in the contract, which might be a sign of a suspicious behavior
      </div>
      <div className={styles.hardcodes}>
        {risks.data.map((address, index) => (
          <div className={styles.hardcode} key={address}>
            <div className={styles.index}>#{Number(index) + 1}</div>
            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.field}>Address:</span>
                <span className={styles.value}>
                  <a target="_blank" rel="noreferrer" href={getEtherscanAddressUrl(address)} className={styles.link}>
                    {formatAddress(address)}
                  </a>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Accordion>
);

HardcodedLogic.defaultProps = {
  className: '',
  isVerified: true,
};

export default HardcodedLogic;
