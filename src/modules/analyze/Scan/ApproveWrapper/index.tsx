import { FC, memo, useMemo } from 'react';

import { createPortal } from 'react-dom';
import Layout from 'components/Layout';
import FooterButtons from 'components/FooterButtons';
import Approve from 'modules/analyze/TokenActions/Approve';
import { AnalyzeTransactionResponse } from 'interfaces/analyze.interfaces';
import { getApprovePriceUsd, getApproveRecipient } from '../helpers/approve.helpers';
import { getWebsiteAlertByStatus } from '../helpers/common.helpers';
import { getApproves } from '../helpers/data.helpers';

type Props = {
  handleProceed: () => void;
  handleDecline: () => void;
  data: AnalyzeTransactionResponse;
};

const ApproveWrapper: FC<Props> = ({ data, handleDecline, handleProceed }) => {
  const {
    usdPrice, websiteAlert, recipient, approves,
  } = useMemo(() => ({
    usdPrice: getApprovePriceUsd(data),
    websiteAlert: getWebsiteAlertByStatus(data.siteAnalysis.status),
    recipient: getApproveRecipient(data),
    approves: getApproves(data),
  }), [data]);

  const renderContent = () => (
    <Layout>
      <Approve usdPrice={usdPrice} websiteAlert={websiteAlert} recipient={recipient} approves={approves} />
      <FooterButtons
        handleDecline={handleDecline}
        handleProceed={handleProceed}
        text="What would you like to do?"
      />
    </Layout>
  );

  return createPortal(renderContent(), document.body);
};

export default memo(ApproveWrapper);
