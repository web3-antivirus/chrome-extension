import { FC } from 'react';
import cn from 'classnames';

import { getTokenUrl } from 'helpers/url.helpers';
import swapIcon from 'assets/images/icons/swap-icon.svg';
import { getImageUrl } from 'helpers/image.helpers';
import stubIcon from 'assets/images/collection/collection-stub.svg';
import nftStubIcon from 'assets/images/collection/nft-stub.svg';
import { getNftName } from 'helpers/common.helpers';
import TokenImage from 'components/TokenImage';

import { formatNumberWithMinValue } from 'helpers/big-number.helpers';
import { SwapNft, SwapPart, SwapToken } from './interfaces';
import styles from './styles.module.scss';
import MarketplaceIcon from './MarketplaceIcon';
import WashTrading from './WashTrading';

interface Props {
  data: {
    income: SwapPart[]
    loss: SwapPart[]
  }
  className?: string;
}

const renderToken = (token: SwapToken) => (
  <div className={cn(styles.row, styles.token)}>
    <div className={styles.data}>
      <TokenImage className={styles.tokenImage} src={token.image || getImageUrl(stubIcon)} alt={token.name} />
      <span className={styles.name}>{token.name}</span>
    </div>
    <div className={cn(styles.value)}>
      <div>{token.amount} {token.symbol}</div>
      {Boolean(token.priceUSD) && <div className={styles.usdPrice}>${formatNumberWithMinValue(token.priceUSD as string)}</div>}
    </div>
  </div>
);

const renderNft = (nft: SwapNft) => (
  <div className={cn(styles.row, styles.nft)}>
    <div className={styles.data}>
      <div className={styles.nftImageWrap}>
        <TokenImage className={styles.nftImage} src={nft.image || getImageUrl(nftStubIcon)} alt={nft.name} />
        {nft.marketplaceIcon && <MarketplaceIcon src={nft.marketplaceIcon} />}
      </div>
      <div className={styles.nameWrap}>
        <div className={styles.top}>
          <a className={cn(styles.name, styles.link)} target="_blank" href={getTokenUrl(nft.address, nft.id)} rel="noreferrer">
            {getNftName(nft.id, nft.name)}
          </a>
          {nft.count > 1 && <span className={styles.count}>x{nft.count}</span>}
          {nft.washTrading && <WashTrading {...nft.washTrading} />}
        </div>
        <div className={styles.collectionName}>{nft.collectionName}</div>
      </div>
    </div>
  </div>
);

const SwapInfo: FC<Props> = ({ className, data }) => {
  const renderData = (items: SwapPart[]) => (
    items.map(({ isToken, item }) => (isToken ? renderToken(item) : renderNft(item))));

  return (
    <div className={cn(styles.wrap, className)}>
      {renderData(data.loss)}
      {Boolean(data.loss.length) && Boolean(data.income.length) && (
        <div className={styles.separator}>
          <div className={styles.icon}><img src={getImageUrl(swapIcon)} alt="" /></div>
        </div>
      )}
      {renderData(data.income)}
    </div>
  );
};

SwapInfo.defaultProps = {
  className: '',
};

export default SwapInfo;
