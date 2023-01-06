import { FC, useState } from 'react';
import cn from 'classnames';
import { getImageUrl } from 'helpers/image.helpers';
import { Tab } from 'interfaces/common.interfaces';

import verifiedIcon from 'assets/images/icons/verified-redesign.svg';
import alertIcon from 'assets/images/icons/danger.svg';

import styles from './styles.module.scss';

interface Props {
  data: Tab[];
  className?: string;
}

const Tabs: FC<Props> = ({
  data, className,
}) => {
  const [activeTab, setActiveTab] = useState(data[0].text);

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={cn(styles.header)}>
        {data.map(({
          text, count, isVerified, hasRisk, icon,
        }) => (
          <button className={cn(styles.tab, { [styles.active]: text === activeTab })} onClick={() => setActiveTab(text)} key={text}>
            <span>{text}</span>
            {Boolean(count) && <span className={styles.count}>({count})</span>}
            {(isVerified || hasRisk) && (
              <img
                className={styles.icon}
                src={getImageUrl(isVerified ? verifiedIcon : icon || alertIcon)}
                alt="verified"
              />
            )}
          </button>
        ))}
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
