import { FC } from 'react';
import { createPortal } from 'react-dom';
import { OrderNftsType } from 'helpers/metamask.helpers';
import FooterButtons from 'components/FooterButtons';
import Layout from 'components/Layout';
import { getShadowRoot } from 'helpers/common.helpers';
import Main from './Main';

import styles from './styles.module.scss';

interface Props {
  onClose: () => void
  proceedTransaction: () => void
  tokens: OrderNftsType
}

const SaleOrdersWrapper: FC<Props> = ({ onClose, proceedTransaction, tokens }) => {

  const renderContent = () => (
    <Layout>
      <div className={styles.wrap}>
        <Main tokens={tokens} />
        <FooterButtons
          handleDecline={onClose}
          handleProceed={proceedTransaction}
          text="What would you like to do?"
        />
      </div>
    </Layout>
  );

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default SaleOrdersWrapper;
