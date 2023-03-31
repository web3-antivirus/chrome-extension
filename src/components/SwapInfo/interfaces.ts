export interface SwapNft {
  image: string;
  name: string;
  address: string;
  id: string;
  count: number;
  collectionName: string;
  marketplaceIcon?: string | null;
  washTrading?: IWashTradingData
}

export interface SwapToken {
  name: string;
  symbol: string;
  image: string;
  amount: number | string;
  priceUSD?: string | null;
}

export type SwapPart = { isToken: true, item: SwapToken } | { isToken: false, item: SwapNft }

export interface IWashTradingData {
  totalTrades: number;
  washTrades: number;
  washTradesPercent: number;
}
