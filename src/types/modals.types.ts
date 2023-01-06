import { MODAL_TYPES } from '../constants/modals.constants';
import { ABIItem, EventDescriptor } from './fetch.type';

export type ShowModal = (modal: MODAL_TYPES, props?: unknown | null) => void

export type ModalsState = {
  current: MODAL_TYPES | null,
  props: unknown | null
}

export type ParamsModalProps = {
  name: string,
  countParams: number | string,
  params: ABIItem,
  events: EventDescriptor[],
  onClose: () => void
}
