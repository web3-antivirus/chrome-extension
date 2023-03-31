import {
  CollectionDescriptor, TokenEntity, WashTradingStatistic, Web3ContractEntityDTO,
} from 'interfaces/analyze.interfaces';
import { AnalysisDescriptorDTO } from './url-analyze.dto';

export interface IMakeOfferResponse {
  token: TokenEntity;
  collection: CollectionDescriptor;
  contracts: Web3ContractEntityDTO[];
  paymentTokenPriceUSD: number;
  fairPriceETH: string;
  siteAnalysis: AnalysisDescriptorDTO;
  washTradingStatistic: WashTradingStatistic;
}
