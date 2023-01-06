/* eslint-disable camelcase */
import {
  FC, memo, useMemo,
} from 'react';

import Popup from 'components/Popup';
import RiskBlock from '../RiskBlock';
import styles from './styles.module.scss';

type Props = {
  code_hash_changed: boolean,
  contains_metamorphic_init_code: boolean,
  contains_selfdestruct: boolean,
  contains_delegatecall: boolean,
  deployed_by_contract: boolean,
  deployer_contains_create2: boolean,
};

const RiskBlocks: FC<Props> = ({
  code_hash_changed,
  contains_metamorphic_init_code,
  contains_selfdestruct,
  contains_delegatecall,
  deployed_by_contract,
  deployer_contains_create2,
}) => {
  const props = useMemo(() => (
    {
      styleType: 'diff' as const,
      className: styles.popup,
      position: 'right center' as const,
      flowing: true,
      hoverable: true,
    }
  ), [styles.popup]);

  return (
    <div className={styles.risksBlocks}>
      <Popup
        {...props}
        trigger={(
          <div className={styles.riskBlockWrapper}>
            <RiskBlock
              hasRisk={code_hash_changed}
              title="Changed code"
              description={code_hash_changed ? 'Contract code has been changed' : 'Contract code hasn\'t been changed'}
            />
          </div>
        )}
      >
        <p className={styles.popupTitle}>
          Indicates that the contract code has been changed. This is a sign of a suspicious contract
        </p>
      </Popup>

      <Popup
        {...props}
        trigger={(
          <div className={styles.riskBlockWrapper}>
            <RiskBlock
              hasRisk={contains_metamorphic_init_code}
              title="Metamorphic code"
              description={contains_metamorphic_init_code
                ? 'Contains bytecode templates of a suspicious contract' : 'Doesn\'t contain bytecode templates of a suspicious contract'}
            />
          </div>
        )}
      >
        <p className={styles.popupTitle}>
          Implies the presence of certain bytecode templates that indicate a suspicious contract
        </p>
      </Popup>

      <Popup
        {...props}
        trigger={(
          <div className={styles.riskBlockWrapper}>
            <RiskBlock
              hasRisk={contains_selfdestruct}
              title="Self-Destruction"
              description={contains_selfdestruct ? 'Contract Is able to self-destruct' : 'Doesn\'t have the ability to self-destruct'}
            />
          </div>
        )}
      >
        <p className={styles.popupTitle}>
          The contract&apos;s ability to self-destruct indicates a suspicious contract.
          The method is not accurate and its absence doesn’t mean that the contract is secure since it can be disguised
        </p>
      </Popup>

      <Popup
        {...props}
        trigger={(
          <div className={styles.riskBlockWrapper}>
            <RiskBlock
              hasRisk={contains_delegatecall}
              title="Call Delegation"
              description={contains_delegatecall
                ? 'Delegates calls to other contracts' : 'Doesn\'t delegate calls to other contracts'}
            />
          </div>
        )}
      >
        <p className={styles.popupTitle}>
          Enables delegating calls to other contracts and can conceal the possibility of self-destruction.
          Can be used in the simplest functioning of the contract. Yet, it doesn&apos;t serve any purpose without other indicators
        </p>
      </Popup>

      <Popup
        {...props}
        trigger={(
          <div className={styles.riskBlockWrapper}>
            <RiskBlock
              hasRisk={deployed_by_contract}
              title="Deployed by contract"
              description={deployed_by_contract ? 'Deployed by another contract' : 'Wasn\'t deployed by another contract'}
            />
          </div>
        )}
      >
        <p className={styles.popupTitle}>
          Means that the contract was initiated and deployed by another contract. This is a key sign of a suspicious contract
        </p>
      </Popup>

      <Popup
        {...props}
        trigger={(
          <div className={styles.riskBlockWrapper}>
            <RiskBlock
              hasRisk={deployer_contains_create2}
              title="Pre-determined address"
              description={deployer_contains_create2
                ? 'Deployed with a pre-determined address' : 'Wasn\'t deployed with a pre-determined address'}
            />
          </div>
        )}
      >
        <p className={styles.popupTitle}>
          Implies that the contract was deployed with a pre-determined address
        </p>
      </Popup>
    </div>
  );
};

export default memo(RiskBlocks);
