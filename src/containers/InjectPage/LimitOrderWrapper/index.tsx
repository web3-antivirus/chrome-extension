import { FC, memo } from 'react';
import { createPortal } from 'react-dom';

import { getShadowRoot } from 'helpers/common.helpers';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import Main from './Main';

interface Props {
  contractAddress: string;
  walletProvider: WALLET_PROVIDERS | null;
  handleProceed: () => void;
  handleDecline: () => void;
}

const LimitOrderWrapper: FC<Props> = ({
  contractAddress, walletProvider, handleProceed, handleDecline,
}) => {

  const renderContent = () => (
    <Main
      contractAddress={contractAddress}
      walletProvider={walletProvider}
      handleProceed={handleProceed}
      handleDecline={handleDecline}
    />
  );

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default memo(LimitOrderWrapper);
