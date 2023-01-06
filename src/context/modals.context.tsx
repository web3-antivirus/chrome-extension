import { FC, useCallback, useState } from 'react';
import { ModalsState, ShowModal } from '../types/modals.types';
import { INITIAL_MODAL_STATE } from '../constants/modals.constants';
import { ModalContext } from '../hooks/modals.hooks';

interface Props {
  children: JSX.Element | JSX.Element[]
}

const ModalsProvider: FC<Props> = ({ children }) => {
  const [state, setState] = useState<ModalsState>(INITIAL_MODAL_STATE);

  const show: ShowModal = useCallback((current, props) => {
    setState({ current, props });
  }, []);

  const hide = useCallback(() => {
    setState(INITIAL_MODAL_STATE);
  }, []);

  return (
    <ModalContext.Provider value={{ state, show, hide }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalsProvider;
