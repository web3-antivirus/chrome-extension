export interface SwapNft {
  image: string;
  name: string;
  address: string;
  id: string;
  count: number;
}

export interface SwapToken {
  name: string;
  image: string;
  amount: number | string;
}

export type SwapPart = { isToken: true, item: SwapToken } | { isToken: false, item: SwapNft }
