/* eslint-disable max-len */
import ProtocolHeader from 'components/assetHeader/ProtocolHeader';
import Tabs from 'components/Tabs';
import { Tab } from 'interfaces/common.interfaces';
import { FC, useMemo } from 'react';
import Risks from 'components/Risks';
import warningIcon from 'assets/images/icons/warning-triangle.svg';

import { TraceWithRisk } from 'types/fetch.type';
import Details from './Details';
import styles from './styles.module.scss';
import Tracing from '../Tracing/Tracing';
import { TokenData, TransactionDetailsData } from '../interfaces';
import { getRisksSum } from '../helpers/data.helpers';
import { NOT_VERIFIED_CONTRACT_HEADER_DESCRIPTION } from '../constants';

interface Props {
  handleGoBack: () => void;
  trace: TraceWithRisk[];
  data: TokenData;
  transactionDetails: TransactionDetailsData;
  hasSimulationAlert: boolean;
}

enum TABS_TEXTS {
  DETAILS = 'TRANSACTION',
  RISKS = 'CONTRACT',
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
      const warningsCount = transactionDetails.warningMessages?.length;
      const dangersCount = transactionDetails.dangerMessages?.length;
      const hasSwapWarning = Boolean((transactionDetails.swap?.loss.length && !transactionDetails.swap.income.length) || warningsCount);

      return [
        ...(hasSwap || transactionDetails.permissionRequest.length ? [{
          text: TABS_TEXTS.DETAILS,
          hasRisk: dangersCount ? false : (hasDetailsRisk || hasSwapWarning),
          icon: (hasSwapWarning && !dangersCount) ? warningIcon : undefined,
          risksCount: dangersCount,
          Component: () => (
            <Details
              swap={hasSwap ? transactionDetails.swap : null}
              permissionRequest={transactionDetails.permissionRequest.length ? transactionDetails.permissionRequest : null}
              dangerMessages={transactionDetails.dangerMessages}
              warningMessages={transactionDetails.warningMessages}
            />
          ),
        }] : []),
        ...(!data.info.isVerified ? [{
          text: TABS_TEXTS.RISKS,
          risksCount: riskSum,
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
            : isAddressVerified ? '' : NOT_VERIFIED_CONTRACT_HEADER_DESCRIPTION
        }
        hasRisk={data.info.hasRisk || !isAddressVerified}
        address={data.info.address}
        isAddressVerified={isAddressVerified}
        isProxy={data.info.isProxy}
        socials={data.info.socials}
        audits={data.info.audits}
      />
      <Tabs data={TABS} />
    </div>
  );
};

export default TransactionInfo;
