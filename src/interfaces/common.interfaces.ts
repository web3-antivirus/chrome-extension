import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import { FC } from 'react';

export interface ICustomEvent { data: { type: string; jsonData: string, walletProvider: WALLET_PROVIDERS | null }; }

export interface Tab {
  text: string;
  count?: number
  isVerified?: boolean
  hasRisk?: boolean
  icon?: string;
  risksCount?: number;
  Component: FC
}

export enum ExtensionUserActionType {
  UserContractDecisionButton = 1,
  FeedbackForm = 2,
  v1TransactionAnalysis = 3,
  ProceedSuspiciousWebsite = 4,
  /**
   * Add: wallet provider, toAddress.
   */
  TransactionAnalysis = 5,
  /**
   * Extension found the address using Levenshtein.
   */
  WebsiteLevenshteinDetection = 100000,
  PhishingMetamaskDetected = 100001,
}

export type ISignMessage = Record<string, string> | string;
