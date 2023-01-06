import {
  FC, memo, useMemo,
} from 'react';
import { Handle, Position } from 'reactflow';
import { NodeProps } from '@reactflow/core/dist/esm/types/nodes';
import cn from 'classnames';
import { getRiskTypeFromRisk } from 'helpers/analyze.helpers';
import { RISK_TYPE } from 'constants/risks.constants';
import alertIcon from 'assets/images/icons/danger.svg';
import { getImageUrl } from 'helpers/image.helpers';

import { separateAddress } from '../../../../../helpers/address.helpers';
import { fromWeiWithoutFormat } from '../../../../../helpers/big-number.helpers';
import { getEtherscanAddressUrl } from '../../../../../helpers/url.helpers';
import styles from './styles.module.scss';
import { ABIItem, EventDescriptor } from '../../../../../types/fetch.type';
import { getCountParams, transformNameMethod } from '../../../../../helpers/tracing.helpers';
import { useModals } from '../../../../../hooks/modals.hooks';
import { MODAL_TYPES } from '../../../../../constants/modals.constants';
import { EMPTY_NAME } from '../../../../../constants/tracing.constants';

type Props = {
  name?: string
  address: string
  value: string | null
  params?: ABIItem
  withoutChildren: boolean,
  isRoot: boolean
  setModalOpen: (isModalOpen: boolean) => void
  events: EventDescriptor[]
  risk: number
};

const TracingBlock: FC<NodeProps<Props>> = ({
  isConnectable, data: {
    name, address, value, params, withoutChildren, isRoot, setModalOpen, events, risk,
  },
}) => {
  const { show } = useModals();

  const onClose = () => {
    setModalOpen(false);
  };
  const hasRisk = useMemo(() => getRiskTypeFromRisk(risk) !== RISK_TYPE.LOW, [risk]);

  const countParams = useMemo(() => (params ? getCountParams(params) : EMPTY_NAME), [params]);

  const isDisable = !(params || !!events.length);
  const handleOpenModal = () => {
    if (isDisable) return;
    show(MODAL_TYPES.PARAMS_MODAL, {
      params, events, onClose, countParams, name: transformNameMethod(name),
    });
    setModalOpen(true);
  };

  return (
    <>
      <div className={cn(styles.tracingBlock, { [styles.pointer]: params })}>
        <button className={styles.openModalButton} disabled={isDisable} onClick={handleOpenModal} aria-label="openModal" />
        <div className={styles.tracingInformation}>
          <p className={styles.bold}><span className={styles.bold}>{transformNameMethod(name) ?? EMPTY_NAME}</span>({countParams})</p>
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
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          id="a"
          isConnectable={isConnectable}
          className={cn(styles.handle, styles.handleIn)}
        />
      )}
      {!withoutChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          isConnectable={isConnectable}
          className={cn(styles.handle, styles.handleOut)}
        />
      )}
    </>
  );
};

export default memo(TracingBlock);
