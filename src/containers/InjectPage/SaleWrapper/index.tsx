import {
  FC,
} from 'react';

import { getShadowRoot } from 'helpers/common.helpers';
import { createPortal } from 'react-dom';
import Layout from 'components/Layout';
import { OrderNftsType } from 'helpers/metamask.helpers';
import Sale from 'modules/analyze/TokenActions/Sale';

type Props = {
  handleProceed: () => void;
  handleDecline: () => void;
  data: OrderNftsType
};

const SaleWrapper: FC<Props> = ({ handleProceed, handleDecline, data }) => {

  const renderContent = () => (
    <Layout>
      <Sale
        data={data}
        handleDecline={handleDecline}
        handleProceed={handleProceed}
      />
    </Layout>
  );

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default SaleWrapper;
