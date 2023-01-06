import { FC } from 'react';
import cn from 'classnames';

import { getTokenUrl } from 'helpers/url.helpers';
import swapIcon from 'assets/images/icons/swap-icon.svg';
import { getImageUrl } from 'helpers/image.helpers';
import stubIcon from 'assets/images/collection/collection-stub.svg';
import { getNftName } from 'helpers/common.helpers';
import TokenImage from 'components/TokenImage';

import { SwapNft, SwapPart, SwapToken } from './interfaces';
import styles from './styles.module.scss';

interface Props {
  data: {
    income: SwapPart[]
    loss: SwapPart[]
  }
  className?: string;
}

const renderToken = (token: SwapToken, isIncome: boolean) => (
  <div className={cn(styles.row, styles.token)}>
    <div className={styles.data}>
      <TokenImage src={token.image || getImageUrl(stubIcon)} alt={token.name} />
      <span className={styles.name}>{token.name}</span>
    </div>
    <div className={cn(styles.value, { [styles.isIncome]: isIncome })}>
      {isIncome ? '+' : '-'}{token.amount}
    </div>
  </div>
);

const renderNft = (nft: SwapNft, isIncome: boolean) => (
  <div className={cn(styles.row, styles.nft)}>
    <div className={styles.data}>
      <TokenImage src={nft.image || getImageUrl(stubIcon)} alt={nft.name} />
      <a className={cn(styles.name, styles.link)} target="_blank" href={getTokenUrl(nft.address, nft.id)} rel="noreferrer">
        {getNftName(nft.id, nft.name)}
      </a>
    </div>
    <div className={cn(styles.value, { [styles.isIncome]: isIncome })}>
      {isIncome ? '+' : '-'}{nft.count} NFT
    </div>
  </div>
);

const SwapInfo: FC<Props> = ({ className, data }) => {

  const renderData = (items: SwapPart[], isIncome: boolean) => (
    items.map(({ isToken, item }) => (isToken ? renderToken(item, isIncome) : renderNft(item, isIncome))));

  return (
    <div className={cn(styles.wrap, className)}>
      {renderData(data.loss, false)}
      {Boolean(data.loss.length) && Boolean(data.income.length) && (
        <div className={styles.separator}>
          <div className={styles.icon}><img src={getImageUrl(swapIcon)} alt="" /></div>
        </div>
      )}
      {renderData(data.income, true)}
    </div>
  );
};

SwapInfo.defaultProps = {
  className: '',
};

export default SwapInfo;
