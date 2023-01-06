import {
  FC, ReactNode, useRef, useState,
} from 'react';
import cn from 'classnames';

import { getImageUrl } from 'helpers/image.helpers';
import alertIcon from 'assets/images/icons/danger.svg';
import checkIcon from 'assets/images/icons/check-circle.svg';
import { ArrowUpIcon } from 'constants/icons.constants';

import styles from './styles.module.scss';

interface Props {
  risksCount: number
  name: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string;
  disabled?: boolean;
}

const Accordion: FC<Props> = ({
  risksCount, name, children, className, defaultOpen, disabled,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn(styles.wrap, className, { [styles.disabled]: disabled })}>
      <button className={styles.header} onClick={() => !disabled && setIsOpen(!isOpen)}>
        <div className={styles.main}>
          <img
            className={styles.icon}
            src={getImageUrl(risksCount ? alertIcon : checkIcon)}
            alt=""
          />
          <span className={styles.name}>{name}</span>
          <span className={styles.risksCount}>({risksCount})</span>
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
};

export default Accordion;
