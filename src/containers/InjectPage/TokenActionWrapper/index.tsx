import { FC, memo } from 'react';
import { createPortal } from 'react-dom';

import { getShadowRoot } from 'helpers/common.helpers';
import { ITokenActionData } from 'helpers/metamask.helpers';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import Main from './Main';

interface Props {
  data: ITokenActionData;
  handleProceed: () => void;
  handleDecline: () => void;
  walletProvider: WALLET_PROVIDERS | null
}

const TokenActionWrapper: FC<Props> = ({
  data, handleProceed, handleDecline, walletProvider,
}) => {

  const renderContent = () => (
    <ErrorBoundary handleError={handleProceed}>
      <Main
        data={data}
        handleProceed={handleProceed}
        handleDecline={handleDecline}
        walletProvider={walletProvider}
      />
    </ErrorBoundary>
  );

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default memo(TokenActionWrapper);
