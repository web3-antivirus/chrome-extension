import { FC } from 'react';
import cn from 'classnames';
import TokenImage from 'components/TokenImage';
import { getNftName, isNull } from 'helpers/common.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import nftStubIcon from 'assets/images/collection/nft-stub.svg';
import { IWashTradingData } from 'components/SwapInfo/interfaces';
import { INftDetails } from 'modules/analyze/Scan/interfaces';
import WashTrading from 'components/SwapInfo/WashTrading';
import { roundNumber } from 'helpers/big-number.helpers';
import styles from './styles.module.scss';

interface Props {
  data: INftDetails,
  price?: {
    usdPrice: string | null,
    symbol: string,
    cryptoPrice: string,
  } | null,
  washTrading?: IWashTradingData,
  className?: string,
}

const Nft: FC<Props> = ({
  data, price, washTrading, className,
}) => (
  <div className={cn(styles.singleNft, className)}>
    <TokenImage className={styles.nftImage} src={data.imageSrc || getImageUrl(nftStubIcon)} alt={data.name} />
    <div className={styles.nameWrap}>
      <div className={styles.top}>
        {getNftName(String(data.id), data.name)}
        {washTrading && <WashTrading {...washTrading} />}
      </div>
      <div className={styles.collectionName}>{data.collectionName}</div>
    </div>
    {price && (
      <div className={styles.price}>
        <div className={styles.eth}>
          {`${price.cryptoPrice} ${price.symbol}`}
        </div>
        {!isNull(price.usdPrice) && (
          <div className={styles.usd}>
            ${roundNumber(price.usdPrice || 0, 2)}
          </div>
        )}
      </div>
    )}
  </div>
);

Nft.defaultProps = {
  price: null,
  washTrading: undefined,
  className: '',
};

export default Nft;
