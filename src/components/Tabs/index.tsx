import { FC, useRef, useState } from 'react';
import cn from 'classnames';
import pluralize from 'pluralize';

import { getImageUrl } from 'helpers/image.helpers';
import { Tab } from 'interfaces/common.interfaces';

import verifiedIcon from 'assets/images/icons/verified-redesign.svg';
import alertIcon from 'assets/images/icons/alert-circle.svg';

import styles from './styles.module.scss';

interface Props {
  data: Tab[];
  className?: string;
}

const Tabs: FC<Props> = ({
  data, className,
}) => {
  const headerWrapRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState(data[0].text);

  const handleTabClick = (text: string) => {
    const isFirstTab = text === data[0].text;
    const isThirdTab = text === data[2]?.text;
    setActiveTab(text);

    if (headerWrapRef.current) {
      if (isFirstTab) { headerWrapRef.current.scrollLeft = 0; }
      if (isThirdTab) { headerWrapRef.current.scrollLeft = headerWrapRef.current?.scrollWidth; }
    }
  };

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.shadowsWrap}>
        <div className={styles.headerWrap} ref={headerWrapRef}>
          <div className={cn(styles.header)}>
            {data.map(({
              text, isVerified, hasRisk, icon, risksCount,
            }) => (
              <button className={cn(styles.tab, { [styles.active]: text === activeTab })} onClick={() => handleTabClick(text)} key={text}>
                <span>{text}</span>
                {(isVerified || hasRisk) && (
                  <img
                    className={styles.icon}
                    src={getImageUrl(isVerified ? verifiedIcon : icon || alertIcon)}
                    alt=""
                  />
                )}
                {Boolean(risksCount)
                && <span className={styles.risksCount}>{`${String(risksCount)} ${pluralize('risk', risksCount)}`}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.body}>
        {data.map(({ Component, text }) => (text === activeTab ? <Component key={text} /> : null))}
      </div>
    </div>
  );
};

Tabs.defaultProps = {
  className: '',
};

export default Tabs;
