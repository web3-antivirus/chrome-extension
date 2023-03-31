export enum ANALYSIS_STATUSES {
  WAITING = 'WAITING',
  SEARCHING = 'SEARCHING',
  SCANNING = 'SCANNING',
  LOADING_RESULTS = 'LOADING_RESULTS',
}

export type AnalysisStatusesForRandom = Exclude<ANALYSIS_STATUSES, ANALYSIS_STATUSES.LOADING_RESULTS | ANALYSIS_STATUSES.WAITING>;

export const ANALYSIS_STATUSES_LABELS = {
  [ANALYSIS_STATUSES.WAITING]: 'Waiting...',
  [ANALYSIS_STATUSES.SEARCHING]: 'Searching...',
  [ANALYSIS_STATUSES.SCANNING]: 'Scanning...',
  [ANALYSIS_STATUSES.LOADING_RESULTS]: 'Loading results...',
};

export const ANALYSIS_RANDOM_STATUSES: Array<AnalysisStatusesForRandom> = [
  ANALYSIS_STATUSES.SEARCHING,
  ANALYSIS_STATUSES.SCANNING,
];

export const STATUS_DURATION_SECONDS = {
  [ANALYSIS_STATUSES.WAITING]: {
    from: 1,
    to: 1.2,
  },
  [ANALYSIS_STATUSES.SEARCHING]: {
    from: 2,
    to: 5,
  },
  [ANALYSIS_STATUSES.SCANNING]: {
    from: 1,
    to: 10,
  },
};