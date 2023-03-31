/* eslint-disable max-len */
import { FC, useMemo } from 'react';
import HighlightAlert from 'components/HighlightAlert';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';
import { ApprovesDetails } from 'modules/analyze/Scan/interfaces';
import HeaderWrap from '../components/HeaderWrap';
import MainInfoWrap from '../components/MainInfoWrap';
import Nfts from '../components/Nfts';
import Recipient from './Recipient';
import Price from '../components/Price';

import styles from './styles.module.scss';
import ERC20 from './ERC20';
import { IRecipient } from './Recipient/interfaces';

interface Props {
  usdPrice: number;
  websiteAlert: IHighlightAlert
  recipient: IRecipient
  approves: ApprovesDetails[]
}

const Approve: FC<Props> = ({
  usdPrice, websiteAlert, recipient, approves,
}) => {
  const isERC20 = useMemo(() => !approves[0].isNft, [approves]);

  return (
    <>
      <HeaderWrap title="Approve access">
        {isERC20 ? (
          <ERC20
            name={approves[0]?.name as string}
            value={approves[0]?.approvedAsset}
            imageSrc={approves[0]?.imageSrc}
          />
        ) : <Nfts data={approves} />}
        <HighlightAlert data={websiteAlert} className={styles.alert} />
      </HeaderWrap>
      <MainInfoWrap>
        {Boolean(usdPrice) && (
          <Price
            usdPrice={usdPrice}
            popupText="The total value of all tokens that may be at risk of loss if you approve the transaction."
            title="Value at risk"
          />
        )}
        <Recipient
          {...recipient}
        />
      </MainInfoWrap>
    </>
  );
};

export default Approve;
