import { FC, memo } from 'react';
import {
  ParamsModalProps,
} from '../../types/modals.types';
import { useModals } from '../../hooks/modals.hooks';
import { MODAL_TYPES } from '../../constants/modals.constants';
import ParamsModal from './ParamsModal';

const Modals: FC = () => {
  const { state } = useModals();

  return (
    <>
      {state.current === MODAL_TYPES.PARAMS_MODAL && <ParamsModal {...state.props as ParamsModalProps} /> }
    </>
  );
};

export default memo(Modals);
