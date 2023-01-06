import { FC, useMemo, memo } from 'react';

import { Tab } from 'interfaces/common.interfaces';
import { Nft } from 'components/assetHeader/CollectionHeader/interfaces';
import warningIcon from 'assets/images/icons/warning-circle.svg';
import CollectionHeader from 'components/assetHeader/CollectionHeader';
import Tabs from 'components/Tabs';
import Risks from 'components/Risks';

import { getDatesDiffInDays } from 'helpers/date.helpers';
import CollectionTab from './Collection';
import { TokenData } from '../interfaces';
import { getRisksSum } from '../helpers';
import { hasCollectionRisks } from './helpers';

interface Props {
  handleGoBack: () => void;
  data: TokenData;
}

enum TABS_TEXTS {
  RISKS = 'RISKS',
  COLLECTION = 'COLLECTION',
}

const CollectionInfo: FC<Props> = ({ handleGoBack, data }) => {
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
              isVerified={isCollectionVerified}
              address={data.info.address}
              transactions={data.info.transactionsCount}
              dateCreation={data.info.createdAt}
              sales={data.info.sales}
              price={data.info.marketCapETH}
              preview={data.info.imageUrl}
              collection={data.info.name}
              quantity={data.info.items}
              owners={data.info.owners}
              id={String(data.info.id)}
              contractName={data.info.contractName}
            />
          ),
        },
      ];

      return !isCollectionVerified ? (
        [
          {
            text: TABS_TEXTS.RISKS,
            hasRisk: Boolean(riskSum),
            count: riskSum,
            Component: () => (
              <Risks
                {...data.risks}
              />
            ),
          },
          ...tabs,
        ]
      ) : tabs;
    }, [data],
  );

  return (
    <>
      <CollectionHeader
        handleGoBack={handleGoBack}
        nfts={(data.info.collectionNfts) as Nft[]}
        isAddressVerified={data.info.isAddressVerified}
        address={data.info.address}
        collectionId={String(data.info.id)}
      />
      <Tabs data={TABS} />
    </>
  );
};

export default memo(CollectionInfo);
