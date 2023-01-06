import { FC } from 'react';
import Image from 'components/Image';
import Loading from 'components/Loading';
import { OrderNftsType } from 'helpers/metamask.helpers';
import { useNftsInfo } from 'services/api/nfts-info.api';
import { useTokenPrice } from 'services/api/token-price.api';
import styles from './styles.module.scss';

interface Props {
  tokens: OrderNftsType
}

const Main: FC<Props> = ({ tokens }) => {
  const { data, loading } = useNftsInfo(tokens.sell);
  const { loading: tokenLoading, price, symbol } = useTokenPrice(tokens.buy.tokenAddress, tokens.buy.weiAmount);

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        You chose
        <span className={styles.count}>&nbsp;({tokens.sell.length})&nbsp;</span>
        NFTs to list on OpenSea:
      </div>
      <div className={styles.tokens}>
        {loading ? (
          <div className={styles.loader}><Loading /></div>
        ) : (
          data?.map(({
            name, animationUrl, croppedPreviewURL, externalId, url,
          }) => (
            <div>
              <Image
                className={styles.img}
                name={name}
                animationUrl={animationUrl}
                croppedPreviewURL={croppedPreviewURL}
                externalId={externalId}
                url={url}
              />
              <div className={styles.name}>{name || `#${externalId}`}</div>
            </div>
          ))
        )}
      </div>
      {((!tokenLoading && price) || tokens.buy.tokensCount) && (
        <div className={styles.price}>
          <div className={styles.text}>
            Your bid is:
          </div>
          <div className={styles.value}>
            {tokens.buy.tokensCount
              ? `${tokens.buy.tokensCount} NFT${tokens.buy.tokensCount > 1 ? 's' : ''}`
              : `${String(price)}${symbol}`}
          </div>
        </div>
      ) }
    </div>
  );
};

export default Main;
