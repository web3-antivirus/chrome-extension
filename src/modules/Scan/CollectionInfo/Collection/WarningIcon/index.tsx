import { FC } from 'react';

import { getImageUrl } from 'helpers/image.helpers';
import warningIcon from 'assets/images/icons/warning.svg';
import Popup from 'components/Popup';

import styles from '../styles.module.scss';

interface Props {
  content: string;
}

const DangerIcon: FC<Props> = ({ content }) => (
  <Popup
    styleType="white"
    position="top center"
    content={content}
    trigger={(
      <div className={styles.iconWrap}>
        <img
          className={styles.icon}
          src={getImageUrl(warningIcon)}
          alt="verified"
        />
      </div>
    )}
  />
);

export default DangerIcon;
