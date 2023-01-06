import { Nft } from 'components/assetHeader/CollectionHeader/interfaces';
import { RisksData } from 'components/Risks/interfaces';
import { SwapPart } from 'components/SwapInfo/interfaces';

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
    collectionNfts?: Nft[];
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
  }
}

export interface SwapDetails { income: SwapPart[]; loss: SwapPart[] }
export interface ApprovesDetails {
  hasRisk: boolean;
  approvedAsset: string;
  address: string;
}

export interface TransactionDetailsData {
  swap: SwapDetails;
  permissionRequest: ApprovesDetails[];
}
