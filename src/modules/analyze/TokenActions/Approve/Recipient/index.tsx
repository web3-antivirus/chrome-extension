import { FC, useMemo } from 'react';
import InfoPopup from 'components/InfoPopup';
import contractIcon from 'assets/images/icons/contract-icon.svg';
import { getImageUrl } from 'helpers/image.helpers';
import Address from 'components/Address';
import ValueWithLabel from 'components/ValueWithLabel';
import { getDateWithFormat } from 'helpers/time.helpers';
import { isNull } from 'helpers/common.helpers';
import styles from './styles.module.scss';
import { IRecipient } from './interfaces';

const Recipient: FC<IRecipient> = ({
  name,
  address,
  isAddressVerified,
  transactionsCount,
  contractCreationDate,
  nftsCount,
}) => {
  const hasData = useMemo(
    () => !isNull(transactionsCount)
      || !isNull(contractCreationDate)
      || !isNull(nftsCount),
    [transactionsCount, contractCreationDate, nftsCount],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        <span>Recipient</span>
        <InfoPopup content="The address that receives tokens." />
      </div>
      <div className={styles.info}>
        <div className={styles.row}>
          <div className={styles.name}>
            <img
              src={getImageUrl(contractIcon)}
              className={styles.icon}
              alt={name}
            />
            <span>{name}</span>
          </div>
          <div className={styles.value}>
            <Address
              address={address}
              isVerified={isAddressVerified}
              alertOnNonVerified
              withChainIcon={false}
            />
          </div>
        </div>
        {hasData && (
          <>
            <div className={styles.separator} />
            <div className={styles.data}>
              {!isNull(transactionsCount) && (
                <ValueWithLabel
                  label="Transactions"
                  value={String(transactionsCount)}
                />
              )}
              {!isNull(contractCreationDate) && (
                <ValueWithLabel
                  label="Contract creation date"
                  value={getDateWithFormat(contractCreationDate) as string}
                />
              )}
              {!isNull(nftsCount) && (
                <ValueWithLabel label="NFTs owned" value={String(nftsCount)} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recipient;
