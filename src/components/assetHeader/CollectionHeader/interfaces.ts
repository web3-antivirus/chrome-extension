export interface Nft {
  name: string;
  collection: string;
  preview?: string;
  address: string;
  id: number | string;
}

export interface Collection {
  address: string;
  isVerified: boolean;
  collection: string;
  hasRisk?: boolean;
  preview?: string;
  price?: number;
  sales?: number;
  quantity?: number;
  owners?: number;
  dateCreation?: string | number | Date;
  transactions?: number;
  id: string | number;
  contractName?: string;
}
