import { FC } from 'react';
import cn from 'classnames';

import {
  DashboardIcon, GlobalIcon, MessageQuestionIcon, TwitterIcon,
} from 'constants/icons.constants';
import styles from './styles.module.scss';

const LINKS = [
  {
    name: 'Dashboard',
    isDisabled: true,
    Icon: DashboardIcon,
  },
  {
    name: 'Website',
    Icon: GlobalIcon,
    link: 'https://w3a.tech/',
  },
  {
    name: 'Twitter',
    Icon: TwitterIcon,
    link: 'https://twitter.com/web3_antivirus/',
  },
  {
    name: 'Report a bug',
    Icon: MessageQuestionIcon,
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSdKn6jo_MVAfL_BzMKDzdxeoj9KhH5DFRkzxXb8fPzVmvCiSw/viewform',
  },
];

const Footer: FC = () => (
  <div className={styles.wrap}>
    {LINKS.map(({
      name, Icon, isDisabled, link,
    }) => (
      <div className={styles.item} key={name}>
        <a key={name} className={cn(styles.link, { [styles.disabled]: isDisabled })} href={link} target="_blank" rel="noreferrer">
          <Icon classNames={styles.icon} />
          <div className={styles.name}>{name}</div>
          <div className={styles.soon}>Soon!</div>
        </a>
      </div>
    ))}
  </div>
);

export default Footer;
