import {
  FC, useRef, useState,
} from 'react';
import pluralize from 'pluralize';
import cn from 'classnames';

import { ArrowUpIcon } from 'constants/icons.constants';
import verifiedIcon from 'assets/images/icons/verified-redesign.svg';
import { getImageUrl } from 'helpers/image.helpers';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import checkIcon from 'assets/images/icons/check-circle.svg';
import { TokenData } from 'modules/analyze/Scan/interfaces';
import { SECURITY_LEVEL, Web3ContractEntity } from 'interfaces/analyze.interfaces';

import { ProtocolRisks } from '../interfaces';
import styles from './styles.module.scss';

interface Props {
  risks: ProtocolRisks[]
  handleTokenSelect: (token: TokenData, type: Web3ContractEntity.type) => void;
}

const TotalRisks: FC<Props> = ({ risks, handleTokenSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  // const totalCount = useMemo(() => risks.reduce((count, risk) => count + (risk.risksCount || 0), 0), [risks]);
  const hasData = risks.length > 3;

  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.wrap}>
      <button className={cn(styles.total, { [styles.noData]: !hasData })} onClick={() => (hasData ? setIsOpen(!isOpen) : null)}>
        <h2>Audited contracts</h2>
        {/* <span className={cn(styles.count, { [styles.hasRisks]: totalCount > 0 })}>({totalCount})</span> */}
        {hasData && <ArrowUpIcon classNames={cn(styles.arrow, { [styles.open]: isOpen })} />}
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: `${!isOpen ? '0px' : `${Number(contentRef.current?.scrollHeight)}px`}` }}
        className={styles.risks}
      >
        {risks.map(({
          name, risksCount, isVerified, risk, description, label, data, contract,
        }) => (
          <button
            className={styles.risk}
            onClick={() => handleTokenSelect(({
              risks: data,
              info: {
                name,
                isAddressVerified: contract?.verified,
                address: contract?.address,
                symbol: contract?.contract?.symbol,
                imageUrl: contract?.contract?.imgURL,
                transactionsCount: contract?.numOfTransactions,
                createdAt: contract?.createdAt,
                isVerified,
                hasRisk: contract?.contract?.securityLevel === SECURITY_LEVEL.BLACKLIST,
              },
            }) as TokenData, contract?.contract?.type as Web3ContractEntity.type)}
            key={name}
          >
            <div className={styles.info}>
              <div className={styles.main}>
                <img
                  className={cn({ [styles.verified]: isVerified })}
                  src={getImageUrl(
                    isVerified ? verifiedIcon
                      : ((!risksCount && contract?.verified) || contract?.contract?.securityLevel === SECURITY_LEVEL.WHITELIST)
                        ? checkIcon : alertIcon,
                  )}
                  alt={isVerified ? 'verified' : risk}
                />
                <span className={styles.name}>{name}</span>
                {label && <span className={styles.label}>{label}</span>}
              </div>
              {description && <p className={styles.description}>{description}</p>}
            </div>
            <div className={styles.risksWrap}>
              {(!isVerified && (contract?.verified || (Boolean(risksCount))))
              && <div className={styles.count}>{risksCount} {pluralize('risk', risksCount)}</div>}
              <ArrowUpIcon classNames={styles.arrowRisk} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TotalRisks;
