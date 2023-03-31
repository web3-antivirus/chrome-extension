import { FC, useMemo, memo } from 'react';

import { Tab } from 'interfaces/common.interfaces';
import warningIcon from 'assets/images/icons/warning-triangle.svg';
import Tabs from 'components/Tabs';
import Risks from 'components/Risks';
import TokenHeader from 'components/assetHeader/TokenHeader';
import { getCollectionUrl } from 'helpers/url.helpers';

import { getDatesDiffInDays } from 'helpers/date.helpers';
import CollectionTab from './Collection';
import { TokenData } from '../interfaces';
import { getRisksSum } from '../helpers/data.helpers';
import { hasCollectionRisks } from './helpers';
import { NOT_VERIFIED_CONTRACT_HEADER_DESCRIPTION } from '../constants';

interface Props {
  handleGoBack: () => void;
  data: TokenData;
}

enum TABS_TEXTS {
  RISKS = 'CONTRACT',
  COLLECTION = 'COLLECTION',
}

const CollectionInfo: FC<Props> = ({ handleGoBack, data }) => {
  const { isAddressVerified } = data.info;
  const TABS: Tab[] = useMemo(
    () => {
      const riskSum = getRisksSum(data.risks);
      const isCollectionVerified = Boolean(data.info.isVerified);
      const hasRisk = (data.info.createdAt && data.info.transactionsCount)
        ? hasCollectionRisks(getDatesDiffInDays(new Date(data.info.createdAt), new Date()), data.info.transactionsCount) : false;

      const tabs = [
        {
          text: TABS_TEXTS.COLLECTION,
          icon: warningIcon,
          hasRisk,
          isVerified: isCollectionVerified,
          Component: () => (
            <CollectionTab
              hasRisk={hasRisk}
              transactions={data.info.transactionsCount}
              dateCreation={data.info.createdAt}
              sales={data.info.sales}
              price={data.info.marketCapETH}
              quantity={data.info.items}
              owners={data.info.owners}
              contractName={data.info.contractName}
            />
          ),
        },
      ];

      return !isCollectionVerified ? (
        [
          {
            text: TABS_TEXTS.RISKS,
            risksCount: riskSum,
            Component: () => (
              <Risks
                {...data.risks}
                isVerified={isAddressVerified}
              />
            ),
          },
          ...tabs,
        ]
      ) : tabs;
    }, [data, isAddressVerified],
  );

  return (
    <>
      <TokenHeader
        handleGoBack={handleGoBack}
        isAddressVerified={data.info.isAddressVerified}
        address={data.info.address}
        name={data.info.name}
        description={!isAddressVerified ? NOT_VERIFIED_CONTRACT_HEADER_DESCRIPTION : ''}
        hasRisk={!isAddressVerified}
        isProxy={data.info.isProxy}
        socials={data.info.socials}
        tokenImage={data.info.imageUrl}
        link={getCollectionUrl(data.info.address, String(data.info.id))}
        audits={data.info.audits}
        isRounded
      />
      <Tabs data={TABS} />
    </>
  );
};

export default memo(CollectionInfo);
