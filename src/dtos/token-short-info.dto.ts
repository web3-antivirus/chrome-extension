import { CollectionDescriptor, TokenEntity } from 'interfaces/analyze.interfaces';

export interface TokenShortInfoDTO {
  externalId: string;
  contractAddress: string;
  url: string;
  name: string;
}

export type TokensInfoDTO = {
  externalId: string;
  contractAddress: string;
  url: string;
  name: string;
  id: number;
  animationUrl: string;
  croppedPreviewURL: string;
}[]

export interface PaymentTokenEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  symbol: string;
  address: string;
  imageUrl: string;
  name: string;
  decimals: number;
}

export interface TokensCollectionsDTO {
  tokens: TokenEntity[];
  collections: CollectionDescriptor[];
}
