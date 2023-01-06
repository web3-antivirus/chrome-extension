import Popup from 'components/Popup';
import { InfoIcon } from 'constants/icons.constants';
import { FC } from 'react';
import cn from 'classnames';
import { StrictPopupProps } from 'semantic-ui-react';
import styles from './styles.module.scss';

type Props = StrictPopupProps & {
  styleType?: 'white' | 'diff' | 'tooltip'
  content: string
  className?: string
}

const InfoPopup: FC<Props> = ({
  styleType, content, className, ...props
}) => (
  <Popup
    styleType={styleType || 'white'}
    content={content}
    position="top center"
    trigger={<span className={styles.wrap}><InfoIcon classNames={cn(styles.icon, className)} /></span>}
    on="hover"
    {...props}
  />
);

InfoPopup.defaultProps = {
  className: '',
  styleType: 'white',
};

export default InfoPopup;
