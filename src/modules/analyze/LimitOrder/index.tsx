import { FC, useState } from 'react';

import { IHighlightAlert, ProtocolRisks } from 'modules/analyze/Scan/ScanningResult/interfaces';
import { TokenData } from '../Scan/interfaces';
import TokenInfo from '../TokenInfo';
import Main from './Main';

interface Props {
  alerts: IHighlightAlert[];
  tokenData: TokenData;
  contractData: ProtocolRisks
}

const LimitOrder: FC<Props> = ({
  alerts, tokenData, contractData,
}) => {
  const [isContractOpen, setIsContractOpen] = useState(false);

  if (isContractOpen) {
    return <TokenInfo data={tokenData} handleGoBack={() => setIsContractOpen(false)} />;
  }

  return <Main alerts={alerts} onContractClick={() => setIsContractOpen(true)} contractData={contractData} />;
};

export default LimitOrder;
