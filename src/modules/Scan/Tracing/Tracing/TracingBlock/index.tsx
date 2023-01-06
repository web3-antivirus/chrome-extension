import {
  FC, memo, useMemo,
} from 'react';
import { getRiskTypeFromRisk } from 'helpers/analyze.helpers';
import { RISK_TYPE } from 'constants/risks.constants';
import alertIcon from 'assets/images/icons/danger.svg';
import { getImageUrl } from 'helpers/image.helpers';

import { separateAddress } from '../../../../../helpers/address.helpers';
import { fromWeiWithoutFormat } from '../../../../../helpers/big-number.helpers';
import { getEtherscanAddressUrl } from '../../../../../helpers/url.helpers';
import styles from './styles.module.scss';
import { getCountParams, transformNameMethod } from '../../../../../helpers/tracing.helpers';
import { ABIItem, EventDescriptor } from '../../../../../types/fetch.type';
import { EMPTY_NAME } from '../../../../../constants/tracing.constants';

type Props = {
  name?: string
  address: string
  value: string | null
  params?: ABIItem
  events: EventDescriptor[]
  risk: number
};

const TracingBlock: FC<Props> = ({
  name, address, value, params, events, risk,
}) => {

  const paramsCount = useMemo(() => (params ? getCountParams(params) : EMPTY_NAME), [params]);
  const hasRisk = useMemo(() => getRiskTypeFromRisk(risk) !== RISK_TYPE.LOW, [risk]);

  return (
    <div className={styles.tracingBlock}>
      <div className={styles.tracingInformation}>
        <p className={styles.bold}><span className={styles.bold}>{transformNameMethod(name) ?? EMPTY_NAME}</span>({paramsCount})</p>
        <div className={styles.blockInfo}>
          <p className={styles.address}>
            Address:
            {hasRisk && <img className={styles.alertIcon} src={getImageUrl(alertIcon)} alt="" /> }
            <a href={getEtherscanAddressUrl(address)} target="_blank" rel="noreferrer" className={styles.link}>
              {separateAddress(address)}
            </a>
          </p>
          {events.map((event) => (
            <p key={event.name}>
              Event:
              <span> {transformNameMethod(event.name)}
                <span> ({event.params ? getCountParams(event.params) : EMPTY_NAME})</span>
              </span>
            </p>
          ))}
        </div>
        <p>
          <span className={styles.bold}>
            {fromWeiWithoutFormat(parseInt(value ?? '0x0', 16), 18)}
          </span>
          <span className={styles.bold}>ETH</span>
        </p>
      </div>
    </div>
  );
};

TracingBlock.defaultProps = {
  name: undefined,
  params: undefined,
};

export default memo(TracingBlock);
