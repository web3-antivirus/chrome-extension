import InfoPopup from 'components/InfoPopup';
import { roundNumber } from 'helpers/big-number.helpers';
import { isNull } from 'helpers/common.helpers';
import { FC } from 'react';
import styles from './styles.module.scss';

export interface IListingInfo {
  totalPrice: string | null;
  openseaFee: string | null;
  creatorRoyalty: string | null;
  receivedAmount: string;
  openseaFeePercent: number | null;
  creatorRoyaltyPercent: number | null;
}

interface Props extends Omit<IListingInfo, 'totalPrice'> {
  symbol: string;
}

const ListingInfo: FC<Props> = ({
  openseaFee, openseaFeePercent, creatorRoyalty, creatorRoyaltyPercent, receivedAmount, symbol,
}) => {
  const hasFeeData = !isNull(creatorRoyalty) && !isNull(openseaFee);

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        <span>Listing information</span>
        <InfoPopup content="NFT sale information, including marketplace fees and creator royalties." />
      </div>
      <div className={styles.info}>
        {!isNull(openseaFee) && (
          <div className={styles.row}>
            <div className={styles.name}>
              OpenSea fee
              <InfoPopup content="A percentage of revenue that the marketplace charges for all NFT transactions." />
            </div>
            <div className={styles.value}>
              <span className={styles.percent}>{roundNumber(openseaFeePercent as number, 2)}%</span>
              <span className={styles.eth}>{openseaFee} {symbol}</span>
            </div>
          </div>
        )}
        {!isNull(creatorRoyalty) && (
          <div className={styles.row}>
            <div className={styles.name}>
              Creator royalty
              <InfoPopup content="Payments to the original NFT creators that are paid out every time their NFTs are sold." />
            </div>
            <div className={styles.value}>
              <span className={styles.percent}>{roundNumber(creatorRoyaltyPercent as number, 2)}%</span>
              <span className={styles.eth}>{creatorRoyalty} {symbol}</span>
            </div>
          </div>
        )}
        {hasFeeData && <div className={styles.separator} />}
        <div className={styles.row}>
          <div className={styles.name}>
            {hasFeeData ? 'You will receive' : 'You will potential receive'}
          </div>
          <div className={styles.value}>
            <span className={styles.bold}>{receivedAmount} {symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
