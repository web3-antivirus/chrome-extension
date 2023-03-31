import {
  FC, ReactNode, useRef, useState,
} from 'react';
import cn from 'classnames';

import { ArrowUpIcon } from 'constants/icons.constants';
import pluralize from 'pluralize';

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
  const isUnknown = !risksCount && !isVerified;

  return (
    <div className={cn(styles.wrap, className, { [styles.disabled]: disabled })}>
      <button className={styles.header} onClick={() => !disabled && setIsOpen(!isOpen)}>
        <span className={styles.name}>{name}</span>
        <div className={styles.iconWrap}>
          <span className={styles.risksCount}>
            {Boolean(risksCount) || (!isUnknown && !risksCount) ? `${risksCount} ${pluralize('risks', risksCount)}` : '? risk'}
          </span>
          <ArrowUpIcon classNames={cn(styles.arrow, { [styles.open]: isOpen })} />
        </div>
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
