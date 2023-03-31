/* eslint-disable max-len */
import { FC } from 'react';

import HighlightsAlerts from 'components/HighlightsAlerts';
import { INftDetails } from 'modules/analyze/Scan/interfaces';
import { IWashTradingData } from 'components/SwapInfo/interfaces';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';
import HeaderWrap from '../components/HeaderWrap';
import Nft from '../components/Nfts/Nft';
import MainInfoWrap from '../components/MainInfoWrap';
import { FAIR_LEVEL, TYPE_TOKEN_ACTION } from './constants';
import FairPrice from './FairPrice';
import styles from './styles.module.scss';

interface Props {
  type: TYPE_TOKEN_ACTION;
  nft: INftDetails;
  washTrading?: IWashTradingData;
  nftPrice: {
    usdPrice: string | null,
    symbol: string,
    cryptoPrice: string,
  }
  alerts: IHighlightAlert[];
  fairLevel: FAIR_LEVEL | null;
  fairPrice?: string;
  fairPercent: number | null;
}

const MakeOffer: FC<Props> = ({
  type, nft, washTrading, nftPrice, alerts, fairLevel, fairPrice, fairPercent,
}) => (
  <div>
    <HeaderWrap title={type}>
      <Nft data={nft} price={nftPrice} washTrading={washTrading} className={styles.nftWrap} />
    </HeaderWrap>
    <MainInfoWrap>
      <FairPrice fairLevel={fairLevel} price={fairPrice} percent={fairPercent || undefined} symbol={nftPrice?.symbol} />
      <HighlightsAlerts alerts={alerts} />
    </MainInfoWrap>
  </div>
);

MakeOffer.defaultProps = {
  washTrading: undefined,
  fairPrice: undefined,
};

export default MakeOffer;
