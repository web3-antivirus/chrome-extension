import { FC } from 'react';
import cn from 'classnames';
import { AuditsData } from 'modules/analyze/Scan/interfaces';
import Popup from 'components/Popup';
import styles from './styles.module.scss';
import { AUDITS, AUDITS_BADGES_URLS } from './constants';

interface Props {
  className?: string;
  data: AuditsData
}

const ContractAudits: FC<Props> = ({ className, data }) => {
  const badges = (Object.keys(data) as AUDITS[]).filter((key) => data[key]).map((key) => ({
    icon: AUDITS_BADGES_URLS[key],
    siteUrl: data[key],
  }));

  const visibleBadges = badges.slice(0, 3);
  const hiddenBadges = badges.slice(3);

  const renderBadges = (badgesData: {
    icon: string;
    siteUrl: string;
  }[]) => badgesData.map(({ icon, siteUrl }) => (
    <a key={siteUrl} href={siteUrl} target="_blank" rel="noreferrer">
      <img src={icon} alt={siteUrl} />
    </a>
  ));

  return badges.length ? (
    <div className={cn(styles.wrap, className)}>
      {renderBadges(visibleBadges)}
      {Boolean(hiddenBadges.length)
      && (
        <Popup
          content={renderBadges(hiddenBadges)}
          trigger={(
            <div className={styles.count}>+{hiddenBadges.length}</div>
          )}
        />
      )}
    </div>
  ) : null;
};

ContractAudits.defaultProps = {
  className: '',
};

export default ContractAudits;
