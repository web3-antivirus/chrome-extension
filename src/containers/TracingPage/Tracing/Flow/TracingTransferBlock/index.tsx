import {
  FC, memo, useMemo,
} from 'react';
import { Handle, Position } from 'reactflow';
import { NodeProps } from '@reactflow/core/dist/esm/types/nodes';
import swapIcon from 'assets/images/icons/swap.svg';
import { getRiskInfoFromRisk } from 'helpers/analyze.helpers';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import Popup from 'components/Popup';
import { separateAddress } from '../../../../../helpers/address.helpers';
import { fromWeiWithoutFormat } from '../../../../../helpers/big-number.helpers';
import { getEtherscanAddressUrl } from '../../../../../helpers/url.helpers';
import styles from './styles.module.scss';
import { getImageUrl } from '../../../../../helpers/image.helpers';

type Props = {
  address: string
  value: string
  risk: number;
};

const TracingTransferBlock: FC<NodeProps<Props>> = ({ isConnectable, data: { address, value, risk } }) => {
  const { hasRisk, text } = useMemo(() => getRiskInfoFromRisk(risk), [risk]);

  return (
    <>
      <div className={styles.tracingBlock}>
        <div className={styles.tracingInformation}>
          <p> <img src={getImageUrl(swapIcon)} alt="swap" className={styles.icon} /><span className={styles.bold}>Transfer ETH</span></p>
          <p className={styles.address}>
            Address:
            {hasRisk && (
              <Popup
                content={text}
                trigger={(
                  <img className={styles.alertIcon} src={getImageUrl(alertIcon)} alt="" />
                )}
              />
            )}
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
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={isConnectable}
        className={styles.handle}
      />
    </>
  );
};

export default memo(TracingTransferBlock);
