import { FC } from 'react';

export interface CustomEvent { data: { type: string; jsonData: string }; }

export interface Tab {
  text: string;
  count?: number
  isVerified?: boolean
  hasRisk?: boolean
  icon?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: FC
}
