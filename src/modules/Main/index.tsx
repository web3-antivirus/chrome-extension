import { FC, memo } from 'react';
import cn from 'classnames';

import { getCodeExecutionEnvironment } from 'helpers/environments.helpers';

import styles from './styles.module.scss';
import Protection from './Protection';
import HowToUse from './HowToUse';

const Main: FC = () => {
  const { isPopUp } = getCodeExecutionEnvironment();

  return (
    <>
      <HowToUse />
      <div className={cn(styles.wrapper, { [styles.scroll]: isPopUp })}>
        {/* <ContractScan /> */}
        <Protection />
      </div>
    </>
  );
};

export default memo(Main);
