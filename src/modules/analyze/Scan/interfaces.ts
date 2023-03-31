import { AUDITS } from 'components/ContractAudits/constants';
import { RisksData } from 'components/Risks/interfaces';
import { TSocials } from 'components/Socials/interfaces';
import { SwapPart } from 'components/SwapInfo/interfaces';

export interface MintingData {
  cap: string | null;
  total: string | null;
}

export type AuditsData = {
  [key in AUDITS]: string
}

export interface TokenData {
  risks: RisksData;
  info: {
    name: string;
    symbol?: string;
    imageUrl?: string;
    address: string;
    isAddressVerified: boolean;
    createdAt?: string;
    priceUSD?: number;
    sales?: number;
    owners?: number;
    marketCapUSD?: number;
    marketCapETH?: number;
    isVerified?: boolean;
    transactionsCount?: number;
    items?: number;
    id?: number;
    hasRisk?: boolean;
    contractName?: string;
    minting?: MintingData;
    isProxy?: boolean;
    socials?: TSocials;
    audits?: AuditsData;
  }
}

export interface SwapDetails { income: SwapPart[]; loss: SwapPart[] }

export interface INftDetails {
  address: string;
  imageSrc?: string;
  collectionName?: string;
  id?: number | string;
  name?: string;
}

export interface INftPrice {
  usdPrice: string | null,
  symbol: string,
  cryptoPrice: string,
}

export interface ApprovesDetails extends INftDetails {
  hasRisk: boolean;
  approvedAsset: string;
  collectionName?: string;
  isNft?: boolean;
}

export interface MessageData { title?: string; message: string}

export interface TransactionDetailsData {
  swap: SwapDetails;
  permissionRequest: ApprovesDetails[];
  dangerMessages?: MessageData[] | null;
  warningMessages?: MessageData[] | null;
}
