import { CallMethodDescriptor, EventDescriptor } from './fetch.type';

export type TransformedTreeType = {
  data: CallMethodDescriptor & {events: EventDescriptor[]} & { risk: number },
  name: string,
  fatherName?: string,
  isRoot?: boolean,
  withoutChildren: boolean
}
