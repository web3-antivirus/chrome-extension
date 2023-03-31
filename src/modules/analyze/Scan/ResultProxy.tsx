import {
  FC, useMemo,
} from 'react';
import { AnalyzeTransactionResponse } from 'interfaces/analyze.interfaces';

import ApproveWrapper from 'modules/analyze/Scan/ApproveWrapper';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import TokenActionWrapper from 'containers/InjectPage/TokenActionWrapper';
import AnalyzeResult from './AnalyzeResult';
import { getFoundationOfferData } from './helpers/offer-data.hepers';

interface Props {
  handleDecline: () => void;
  handleProceed: () => void;
  data: AnalyzeTransactionResponse;
  projectAddress: string;
  walletProvider: WALLET_PROVIDERS | null
}

const ResultProxy: FC<Props> = ({
  data, handleDecline, handleProceed, projectAddress, walletProvider,
}) => {
  const isApprove = useMemo(() => {
    const {
      approves, from, to, eth,
    } = data.traceOperations;
    const hasApproves = approves.length > 0;
    const hasNoSwapData = !Number(eth) && !from.length && !to.length;
    return hasApproves && hasNoSwapData;
  }, [data]);

  const offerData = useMemo(() => getFoundationOfferData(data), [data]);

  if (isApprove) {
    return (
      <ApproveWrapper
        handleDecline={handleDecline}
        handleProceed={handleProceed}
        data={data}
      />
    );
  }

  if (offerData) {
    return (
      <TokenActionWrapper
        handleDecline={handleDecline}
        handleProceed={handleProceed}
        data={offerData}
        walletProvider={walletProvider}
      />
    );
  }

  return (
    <AnalyzeResult
      handleDecline={handleDecline}
      handleProceed={handleProceed}
      data={data}
      projectAddress={projectAddress}
    />
  );
};
export default ResultProxy;
