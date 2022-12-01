export interface PerformanceAnalysisDTO {
  priceGrowth: number;
  collectionFloorPriceGrowth: number;
  collectionAveragePriceGrowth: number;
  collectiblePriceVsCollectionFloorPriceGrowth: number;
  collectiblePriceVsCollectionAvgPriceGrowth: number;
  totalUsdVolume: string;
  totalEthVolume: number;
  collectionVolumeGrowth: number;
}
