import { FC } from 'react';
import { createPortal } from 'react-dom';
import HeaderRisk from 'layouts/HeaderRisk';
import Layout from 'components/Layout';
import FooterButtons from 'components/FooterButtons';
import { RISK_TYPE } from 'constants/risks.constants';
import { ALERT_TITLE } from 'constants/alert.constants';
import { getShadowRoot } from 'helpers/common.helpers';

import styles from './styles.module.scss';

type Props = {
  description?: JSX.Element
  title?: string
  isMalicious?: boolean
  handleClose: () => void
  handleProceed: () => void
};

const Alert: FC<Props> = ({
  title, description, isMalicious, handleClose, handleProceed,
}) => {

  const renderContent = () => (
    <Layout
      headerChild={(
        <HeaderRisk
          message={isMalicious ? ALERT_TITLE.MALICIOUS_EXTENSION : ALERT_TITLE.SUSPICIOUS_ACTIVITY}
          riskType={RISK_TYPE.CRITICAL}
        />
      )}
    >
      {isMalicious ? (
        <div className={styles.wrap}>
          <p className={styles.text}>
            Disabled extension:
            <span className={styles.name}>{title}</span>
          </p>
        </div>
      ) : (
        <div className={styles.wrap}>
          <div className={styles.textWrap}>
            {title && <p className={styles.title}>{title}</p>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <FooterButtons
            className={styles.footerBtn}
            handleDecline={handleClose}
            handleProceed={handleProceed}
          />
        </div>
      )}
    </Layout>
  );

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default Alert;
