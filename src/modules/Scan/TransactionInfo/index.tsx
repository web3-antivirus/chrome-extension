/* eslint-disable max-len */
import ProtocolHeader from 'components/assetHeader/ProtocolHeader';
import Tabs from 'components/Tabs';
import { Tab } from 'interfaces/common.interfaces';
import { FC, useMemo } from 'react';
import Risks from 'components/Risks';

import { TraceWithRisk } from 'types/fetch.type';
import Details from './Details';
import styles from './styles.module.scss';
import Tracing from '../Tracing/Tracing';
import { TokenData, TransactionDetailsData } from '../interfaces';
import { getRisksSum } from '../helpers';
import { NOT_VERIFIED_CONTRACT_DESCRIPTION } from '../constants';

interface Props {
  handleGoBack: () => void;
  trace: TraceWithRisk[];
  data: TokenData;
  transactionDetails: TransactionDetailsData;
  hasSimulationAlert: boolean;
}

enum TABS_TEXTS {
  DETAILS = 'DETAILS',
  RISKS = 'RISKS',
  EMULATION = 'SIMULATION',
}

const TransactionInfo: FC<Props> = ({
  handleGoBack, trace, data, transactionDetails, hasSimulationAlert,
}) => {
  const { isAddressVerified } = data.info;

  const TABS: Tab[] = useMemo(
    () => {
      const riskSum = getRisksSum(data.risks);
      const hasDetailsRisk = transactionDetails.permissionRequest.some((request) => request.hasRisk);
      const hasSwap = transactionDetails.swap.income.length || transactionDetails.swap.loss.length;

      return [
        ...(hasSwap || transactionDetails.permissionRequest.length ? [{
          text: TABS_TEXTS.DETAILS,
          hasRisk: hasDetailsRisk,
          Component: () => (
            <Details
              swap={hasSwap ? transactionDetails.swap : null}
              permissionRequest={transactionDetails.permissionRequest.length ? transactionDetails.permissionRequest : null}
            />
          ),
        }] : []),
        ...(!data.info.isVerified ? [{
          text: TABS_TEXTS.RISKS,
          hasRisk: Boolean(riskSum),
          count: riskSum,
          Component: () => (
            <Risks
              {...data.risks}
              isVerified={isAddressVerified}
            />
          ),
        }] : []),
        {
          hasRisk: hasSimulationAlert,
          text: TABS_TEXTS.EMULATION,
          Component: () => <Tracing trace={trace} hasSimulationAlert={hasSimulationAlert} />,
        },
      ];
    },
    [trace, isAddressVerified],
  );

  return (
    <div className={styles.wrap}>
      <ProtocolHeader
        handleGoBack={handleGoBack}
        name={data.info.name}
        isVerified={data.info.isVerified}
        description={
          data.info.isVerified
            ? 'You can trust the website, it is on the W3A whitelist. That\'s why we don\'t show any risks.'
            : isAddressVerified ? NOT_VERIFIED_CONTRACT_DESCRIPTION : ''
        }
        hasRisk={data.info.hasRisk || !isAddressVerified}
        address={data.info.address}
        isAddressVerified={isAddressVerified}
      />
      <Tabs data={TABS} />
    </div>
  );
};

export default TransactionInfo;
