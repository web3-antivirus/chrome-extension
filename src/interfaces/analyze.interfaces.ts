/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */

import { Service3Descriptor } from 'types/fetch.type';

export enum ProjectAnalysisStatus {
  /**
     * We found URL in Blacklist Blockchain Project table.
     */
  Dangerous = 'dangerous',
  /**
     * We found URL in Whitelist Blockchain Project table.
     */
  Validated = 'validated',
  /**
     * We didn't find URL in table, but analyzer found something weird.
     */
  Suspicious = 'suspicious',
  /**
     * 1st and 2nd cases didn't return anything.
     */
  Neutral = 'neutral',
}

export interface SuspiciousAnalysisPayloadDTO {
  nearestURL: string;
  levensteinDistance: number;
}

export interface ValidatedAnalysisPayloadDTO {
  name: string;
  category: string;
  subcategory: string;
}

export class ValidatedAnalysisDescriptorDTO {

  status: ProjectAnalysisStatus.Validated;

  payload: ValidatedAnalysisPayloadDTO;

}

export class SuspiciousAnalysisDescriptorDTO {

  status: ProjectAnalysisStatus.Suspicious;

  payload: SuspiciousAnalysisPayloadDTO;

}

export class BaseAnalysisDescriptorDTO {

  status: ProjectAnalysisStatus;

}

export type AnalysisDescriptorDTO =
  | ValidatedAnalysisDescriptorDTO
  | SuspiciousAnalysisDescriptorDTO
  | BaseAnalysisDescriptorDTO;

export declare type CollectionStatisticDTO = {
  numOfOwners: number;
  numOfTokens: number;
  marketCapUSD: number;
  marketCapETH: string;
  floorPriceUSD: number;
  floorPriceETH: number | null;
  sales: number;
};

export declare type ContractCodeAnalysisDTO = {
  name: string;
  verified: boolean;
  service1: {
    detectors: {
      check: string;
      impact: string;
    }[]
  };
  service2: any;
  service3: Service3Descriptor;
};

export declare type ContractScamAnalysisDTO = {
  service1: any;
  service2: any;
};

export interface Socials {
  email: string;
  site: string;
  blog: string;
  twitter: string;
  gitHub: string;
  discord: string;
  reddit: string;
  telegram: string;
  linkedIn: string;
  facebook: string;
  slack: string;
  ticketing: string;
  opensea: string;
  uniswap: string;
  whitepaper: string;
  weChat: string;
  bitcointalk: string;
  coinMarketCap: string;
  coinGecko: string;
}

export declare type Web3ContractEntityDTO = {
  id: number;
  createdAt: string;
  updatedAt: string;
  address: string;
  type: Web3ContractEntity.type;
  network: Web3ContractEntity.network;
  codeAnalysisStatus: Web3ContractEntity.codeAnalysisStatus;
  codeAnalysisResult: any;
  scamAnalysisStatus: Web3ContractEntity.scamAnalysisStatus;
  scamAnalysisResult: any;
  whitelist: boolean;
  projectId: number;
  name: string;
  symbol: string;
  imgURL: string;
  decimals: number | null;
  securityLevel: SECURITY_LEVEL;
  socials: Socials;
};

export namespace Web3ContractEntity {
  export enum type {
    ERC721,
    ERC1155,
    ERC20
  }
  export enum network {
    ETHEREUM = 'Ethereum'
  }
  export enum codeAnalysisStatus {
    NOT_ANALYZED = 'NotAnalyzed',
    ANALYZING = 'Analyzing',
    ANALYZED = 'Analyzed',
    ERROR_DURING_ANALYZING = 'ErrorDuringAnalyzing',
    ANALYZING_TIMEOUT = 'AnalyzingTimeout',
    REPEAT_ANALYSIS = 'RepeatAnalysis'
  }
  export enum scamAnalysisStatus {
    NOT_ANALYZED = 'NotAnalyzed',
    ANALYZING = 'Analyzing',
    ANALYZED = 'Analyzed',
    ERROR_DURING_ANALYZING = 'ErrorDuringAnalyzing',
    ANALYZING_TIMEOUT = 'AnalyzingTimeout',
    REPEAT_ANALYSIS = 'RepeatAnalysis'
  }
}

export enum SECURITY_LEVEL {
  NO_DATA,
  WHITELIST,
  BLACKLIST,
}

export declare type ContractAnalysisDTO = {
  risk: number;
  address: string;
  contract: Web3ContractEntityDTO;
  verified: boolean;
  createdAt: string;
  numOfTransactions: number;
  priceUSD: number;
  priceETH: string;
  scam: ContractScamAnalysisDTO;
  code: ContractCodeAnalysisDTO;
  securityLevel: SECURITY_LEVEL;
  proxy: boolean;
};

export declare type TransferMethodDescriptor = {
  contractAddress: string;
  from: string;
  to: string;
  tokenId: string;
  amount: number;
  value: string;
  projectId: number;
};

export declare type ApproveMethodDescriptor = {
  contractAddress: string;
  to: string;
  value: string | null;
};

export declare type TransactionOperationsDescriptor = {
  eth: string;
  from: Array<TransferMethodDescriptor>;
  to: Array<TransferMethodDescriptor>;
  approves: Array<ApproveMethodDescriptor>;
};

export declare type CollectionDescriptor = {
  id: number;
  name: string;
  logo: string;
  isVerified: boolean;
  contractAddress: string;
  firstEventAt: string;
  statistic: CollectionStatisticDTO;
};

export declare type AttributeEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  tokenId: number;
  collectionId: number;
  displayType: string;
  traitType: string;
  numberValue: number;
  value: string;
  token: TokenEntity;
  collection: CollectionEntity;
};

export declare type Web3ProjectEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  slug: string;
  numOfAccounts: number;
  previewURL: string | null;
};

export declare type TokenEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  externalId: string;
  collectionId: number;
  contractAddress: string;
  contractId: number;
  name: string;
  description: string;
  unlockableContent: boolean;
  isEditableMetadata: boolean;
  quantity: number;
  previewUrl: string;
  animationUrl: string;
  fileType: string;
  url: string;
  croppedPreviewURL: string;
  previewStatus: boolean;
  storageType: TokenEntity.storageType;
  mintedAt: string;
  metaUrl: string;
  externalUrl: string;
  attributesCount: number;
  collection: CollectionEntity;
  contract: ContractEntity;
  ownerAccounts: Array<string>;
  attributes: Array<AttributeEntity>;
  collectionName: string;
  creatorAccountAddress: string;
  creatorAccountName: string;
  dailyPriceGrowth: string;
  weeklyPriceGrowth: string;
  monthlyPriceGrowth: string;
  totalPriceGrowth: string;
  statRarityScore: string;
  statisticStatus: number;
  lastEventAt: string;
};

export declare type CategoryEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export declare type AccountEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  avatarUrl: string;
};

export declare type CollectionEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  logo: string;
  creatorAccountId: number;
  ownerFee: number;
  protocolFee: number;
  termsAndConditionsUrl: string;
  totalSupply: number;
  totalSupplyEdition: number;
  categoryId: number;
  marketPlaceAPIUrl: string;
  marketPlaceCollectionName: string;
  marketPlaceCollectionDescription: string;
  discordUrl: string;
  externalUrl: string;
  mediumUsername: string;
  telegramUrl: string;
  twitterUsername: string;
  instagramUsername: string;
  wikiUrl: string;
  imageUrl: string;
  featuredImageUrl: string;
  largeImageUrl: string;
  bannerImageUrl: string;
  oneDayVolume: string;
  oneDayChange: string;
  oneDaySales: number;
  oneDayAveragePrice: string;
  sevenDayVolume: string;
  sevenDayChange: string;
  sevenDaySales: number;
  sevenDayAveragePrice: number;
  thirtyDayVolume: string;
  thirtyDayChange: string;
  thirtyDaySales: number;
  thirtyDayAveragePrice: string;
  totalVolume: string;
  totalSales: number;
  numOwners: number;
  averagePrice: string;
  marketCap: string;
  floorPrice: string;
  statsUpdatedAt: string;
  category: CategoryEntity;
  creatorAccount: AccountEntity;
};

export declare type ContractEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  address: string;
  creatorAccountId: number;
  type: ContractEntity.type;
  network: ContractEntity.network;
  totalSupply: number;
  totalSupplyEdition: number;
  creatorAccount: AccountEntity;
  analysisStatus: number;
  analysisResult: any;
  scamAnalysisStatus: number;
  scamAnalysisResult: any;
  tokenOfferStatus: number;
  lastTokenOfferAt: string;
  firstTokenOfferAt: string;
};
export namespace ContractEntity {
  export enum type {
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155'
  }
  export enum network {
    ETHEREUM = 'ethereum',
    MATIC = 'matic'
  }
}

export namespace TokenEntity {
  export enum storageType {
    DECENTRALIZED = 'decentralized',
    CENTRALIZED = 'centralized',
  }
}

export type AnalyzeTransactionResponse = {
  activeProjectId: number;
  projects: Array<Web3ProjectEntity>;
  tokens: Array<TokenEntity>;
  collections: Array<CollectionDescriptor>;
  siteAnalysis: AnalysisDescriptorDTO;
  traceOperations: TransactionOperationsDescriptor;
  contractsAnalysis: Array<ContractAnalysisDTO>;
  trace: Array<any>;
  contracts: Array<Web3ContractEntityDTO>
};
