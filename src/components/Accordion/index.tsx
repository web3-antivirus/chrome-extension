import {
  FC, ReactNode, useRef, useState,
} from 'react';
import cn from 'classnames';

import { getImageUrl } from 'helpers/image.helpers';
import alertIcon from 'assets/images/icons/danger.svg';
import checkIcon from 'assets/images/icons/check-circle.svg';
import { ArrowUpIcon } from 'constants/icons.constants';
import unknownIcon from 'assets/images/icons/unknown-icon.svg';

import styles from './styles.module.scss';

interface Props {
  risksCount: number
  name: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string;
  disabled?: boolean;
  isVerified?: boolean,
}

const Accordion: FC<Props> = ({
  risksCount, name, children, className, defaultOpen, disabled, isVerified,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn(styles.wrap, className, { [styles.disabled]: disabled })}>
      <button className={styles.header} onClick={() => !disabled && setIsOpen(!isOpen)}>
        <div className={styles.main}>
          <img
            className={cn(styles.icon, { [styles.round]: !risksCount && !isVerified })}
            src={getImageUrl(risksCount ? alertIcon : (isVerified ? checkIcon : unknownIcon))}
            alt=""
          />
          <span className={styles.name}>{name}</span>
          {(isVerified || Boolean(risksCount)) && <span className={styles.risksCount}>({risksCount})</span>}
        </div>
        {!disabled && (
          <div className={styles.iconWrap}>
            <ArrowUpIcon classNames={cn(styles.arrow, { [styles.open]: isOpen })} />
          </div>
        )}
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight: `${!isOpen ? '0px' : `${Number(contentRef.current?.scrollHeight)}px`}` }}
        className={cn(styles.content, { [styles.open]: isOpen })}
      >
        {children}
      </div>
    </div>
  );
};

Accordion.defaultProps = {
  className: '',
  defaultOpen: false,
  disabled: false,
  isVerified: true,
};

export default Accordion;
