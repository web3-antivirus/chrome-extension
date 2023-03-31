import { FC } from 'react';
import TokenImage from 'components/TokenImage';
import questionIcon from 'assets/images/icons/question-round.svg';
import { getImageUrl } from 'helpers/image.helpers';

import styles from './styles.module.scss';

interface Props {
  src?: string | null;
}

const MarketplaceIcon: FC<Props> = ({ src }) => (
  <TokenImage
    src={src || getImageUrl(questionIcon)}
    className={styles.marketplaceIcon}
    stub={questionIcon}
  />
);

MarketplaceIcon.defaultProps = {
  src: '',
};

export default MarketplaceIcon;
