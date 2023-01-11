import { FC } from 'react';
import { createPortal } from 'react-dom';

import Layout from 'components/Layout';
import { getImageUrl } from 'helpers/image.helpers';
import attentionIcon from 'assets/images/icons/attention-icon.svg';
import styles from './styles.module.scss';

interface Props {
  description?: string
  title: string
  onClose: () => void
}

const PopupNotification: FC<Props> = ({ title, description }) => {

  const renderContent = () => (
    <Layout>
      <div className={styles.wrap}>
        <img src={getImageUrl(attentionIcon)} alt="attention" className={styles.icon} />
        <div className={styles.description}>{description}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </Layout>
  );

  const root = document.getElementById('web3-antivirus-host')?.shadowRoot?.getElementById('web3-antivirus');

  return createPortal(renderContent(), root || document.body);
};

export default PopupNotification;
