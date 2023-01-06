import {
  FC, memo,
} from 'react';
import ReactJson from 'react-json-view';
import { ReactComponent as CloseIcon } from 'assets/images/tracing/close-icon.svg';
import { Modal } from 'semantic-ui-react';
import cn from 'classnames';
import { useModals } from '../../../hooks/modals.hooks';
import { ParamsModalProps } from '../../../types/modals.types';
import { getCountParams, transformNameMethod } from '../../../helpers/tracing.helpers';
import { EMPTY_NAME } from '../../../constants/tracing.constants';
import styles from './styles.module.scss';

type Props = ParamsModalProps

const reactJsonStyle = {
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '21px',
  whiteSpace: 'nowrap',
};

const ParamsContent: FC<Props> = ({
  params, events, name, countParams, onClose,
}) => {
  const { hide } = useModals();

  const handleClose = () => {
    onClose();
    hide();
  };

  return (
    <Modal open className={cn(styles.modal, 'light-ext')}>
      <div className={styles.wrapper}>
        <button className={styles.closeButton} onClick={handleClose}>
          <CloseIcon />
        </button>
        <p className={styles.methodTitle}>{name}</p>
        {events.map((event) => (
          <div key={event.name} className={styles.section}>
            <p className={styles.sectionTitle}>{transformNameMethod(event.name)} parameters
              <span>({event.params ? getCountParams(event.params) : EMPTY_NAME})</span>
            </p>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <ReactJson src={event} style={reactJsonStyle} displayDataTypes={false} collapsed={1} enableClipboard={false} />
          </div>
        ))}
        {params && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Methods parameters <span>({countParams})</span></p>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <ReactJson src={params} style={reactJsonStyle} displayDataTypes={false} collapsed={1} enableClipboard={false} />
          </div>
        )}
      </div>
    </Modal>
  );

};

export default memo(ParamsContent);
