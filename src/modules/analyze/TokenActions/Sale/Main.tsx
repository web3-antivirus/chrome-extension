import { FC } from 'react';

import HighlightAlert from 'components/HighlightAlert';
import FooterButtons from 'components/FooterButtons';
import { INftDetails } from 'modules/analyze/Scan/interfaces';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';
import { isNull } from 'helpers/common.helpers';
import Nfts from '../components/Nfts';
import MainInfoWrap from '../components/MainInfoWrap';
import HeaderWrap from '../components/HeaderWrap';
import ListingInfo, { IListingInfo } from './ListingInfo';
import Price from '../components/Price';
import styles from './styles.module.scss';

interface Props {
  listingInfo: IListingInfo;
  symbol: string;
  siteAlert: IHighlightAlert;
  nfts: INftDetails[];
  handleDecline: () => void;
  handleProceed: () => void;
}

const Main: FC<Props> = ({
  nfts, siteAlert, listingInfo, symbol, handleProceed, handleDecline,
}) => (
  <>
    <HeaderWrap title="Listing">
      {nfts?.length > 0 && <Nfts data={nfts} />}
      <HighlightAlert data={siteAlert} className={styles.alert} />
    </HeaderWrap>
    <MainInfoWrap>
      {!isNull(listingInfo.totalPrice) && (
        <Price
          cryptoPrice={listingInfo.totalPrice}
          symbol={symbol}
          title="List price"
          popupText="NFT sale price. Fees and royalties will be deducted from this amount."
        />
      )}
      <ListingInfo
        {...listingInfo}
        symbol={symbol}
      />
    </MainInfoWrap>

    <FooterButtons
      handleDecline={handleDecline}
      handleProceed={handleProceed}
      text="What would you like to do?"
    />
  </>
);

export default Main;
