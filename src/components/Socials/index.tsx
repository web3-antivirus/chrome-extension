import { FC } from 'react';
import cn from 'classnames';
import Popup from 'components/Popup';

import { TSocials } from './interfaces';
import styles from './styles.module.scss';
import { SOCIALS, SOCIAL_ICONS, SOCIAL_LABELS } from './constants';

interface Props {
  className?: string
  data: TSocials
}

const Socials: FC<Props> = ({ data, className }) => (
  <div className={cn(styles.wrap, className)}>
    {(Object.keys(data) as SOCIALS[]).filter((key) => data[key]).map((key) => {
      const Icon = SOCIAL_ICONS[key];
      return (
        <Popup
          content={SOCIAL_LABELS[key]}
          key={key}
          trigger={(
            <a key={key} className={cn(styles.link)} href={data[key] as string} target="_blank" rel="noreferrer">
              <Icon classNames={styles.icon} />
            </a>
          )}
        />
      );
    })}
  </div>
);

Socials.defaultProps = {
  className: '',
};

export default Socials;
