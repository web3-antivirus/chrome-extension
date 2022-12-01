import { FC } from 'react';
import { createPortal } from 'react-dom';

import attentionIcon from 'assets/images/icons/attention-icon.svg';
import { getImageUrl } from 'helpers/image.helpers';
import FooterButtons from 'components/FooterButtons';
import Layout from 'components/Layout';

import styles from './styles.module.scss';

type Props = {
  description?: JSX.Element
  title: string
  handleClose: () => void
  handleProceed: () => void
};

const Alert: FC<Props> = ({
  title, description, handleClose, handleProceed,
}) => {

  const renderContent = () => (
    <Layout>
      <div className={styles.wrap}>
        <img src={getImageUrl(attentionIcon)} alt="alert" className={styles.icon} />
        <div>
          <p className={styles.title}>{title}</p>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <FooterButtons handleDecline={handleClose} handleProceed={handleProceed} withText={false} />
      </div>
    </Layout>
  );

  return createPortal(renderContent(), document.body);
};

export default Alert;
