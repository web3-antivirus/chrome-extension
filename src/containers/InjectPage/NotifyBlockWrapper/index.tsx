import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import NotifyBlock from 'components/NotifyBlock';
import verifiedIcon from 'assets/images/icons/verified-redesign.svg';
import { TIME_OF_SHOWING_VERIFY_BLOCK } from 'constants/web3-guard.constants';
import { getShadowRoot } from 'helpers/common.helpers';
import styles from './styles.module.scss';

type Props = {
  description?: string
  title: string
  handleClose?: () => void
  icon?: string
};

const NotifyBlockWrapper: FC<Props> = ({
  title, description, handleClose, icon,
}) => {
  const [isShowBlock, setIsShowBlock] = useState(true);

  setTimeout(() => {
    setIsShowBlock(false);
    if (handleClose) {
      handleClose();
    }
  }, TIME_OF_SHOWING_VERIFY_BLOCK);

  const renderContent = () => (
    isShowBlock
      ? (
        <div className={cn(styles.wrapper, 'light-ext', 'web3-antivirus')}>
          <NotifyBlock
            src={icon || verifiedIcon}
            alt="check icon"
            title={title}
            description={description}
            classNameIcon={styles.icon}
          />
        </div>
      )
      : null
  );

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default NotifyBlockWrapper;
