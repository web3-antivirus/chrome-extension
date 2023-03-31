export interface IRecipient {
  name: string;
  address: string;
  isAddressVerified?: boolean;
  transactionsCount?: number;
  contractCreationDate?: string;
  nftsCount?: number;
}
