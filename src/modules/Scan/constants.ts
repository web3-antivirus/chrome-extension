import { RISK_TYPE } from 'constants/risks.constants';
import { ProjectAnalysisStatus } from 'interfaces/analyze.interfaces';

export enum ANALYSIS_STATUSES {
  WAITING = 'WAITING',
  TRACING = 'TRACING',
  SEARCHING = 'SEARCHING',
  SCANNING = 'SCANNING',
  LOADING_RESULTS = 'LOADING_RESULTS',
}

export type AnalysisStatusesForRandom = Exclude<ANALYSIS_STATUSES, ANALYSIS_STATUSES.LOADING_RESULTS | ANALYSIS_STATUSES.WAITING>;

export const ANALYSIS_STATUSES_LABELS = {
  [ANALYSIS_STATUSES.WAITING]: 'Waiting...',
  [ANALYSIS_STATUSES.TRACING]: 'Tracing...',
  [ANALYSIS_STATUSES.SEARCHING]: 'Searching...',
  [ANALYSIS_STATUSES.SCANNING]: 'Scanning...',
  [ANALYSIS_STATUSES.LOADING_RESULTS]: 'Loading results...',
};

export const STATUS_DURATION_SECONDS = {
  [ANALYSIS_STATUSES.WAITING]: {
    from: 1,
    to: 1.2,
  },
  [ANALYSIS_STATUSES.TRACING]: {
    from: 1,
    to: 3,
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

export enum RESULT_SCREENS {
  SCANNING_RESULT,
  WEBSITE_PROTOCOL,
  COLLECTION,
  ERC20,
}

export const RISK_ALERT_TEXTS = {
  [RISK_TYPE.LOW]: 'No risks detected',
  [RISK_TYPE.MIDDLE]: 'Medium risk detected',
  [RISK_TYPE.CRITICAL]: 'Critical risk detected',
};

export const SITE_ANALYSIS_INFO = {
  [ProjectAnalysisStatus.Neutral]: {
    risk: RISK_TYPE.MIDDLE,
    text: 'Website is not flagged',
  },
  [ProjectAnalysisStatus.Dangerous]: {
    risk: RISK_TYPE.CRITICAL,
    text: 'W3A blacklist website',
  },
  [ProjectAnalysisStatus.Suspicious]: {
    risk: RISK_TYPE.CRITICAL,
    text: 'Website flagged',
  },
  [ProjectAnalysisStatus.Validated]: {
    risk: RISK_TYPE.LOW,
    text: 'W3A whitelist website',
  },
};

export const VERIFIED_CONTRACT_DESCRIPTION = 'The contract is in the W3A whitelist. You can trust it.';
export const NOT_VERIFIED_CONTRACT_DESCRIPTION = 'The contract is not verified.';

// https://github.com/crytic/slither
export const CODE_DETECTORS_INFO: { [x: string]: string } = {
  suicidal: 'Functions allowing anyone to destruct the contract',
  'unprotected-upgrade': 'Unprotected upgradeable contract',
  'controlled-delegatecall': 'Controlled delegatecall destination',
  'delegatecall-loop': 'Payable functions using delegatecall inside a loop',
  'reentrancy-eth': 'Reentrancy vulnerabilities (theft of ethers)',
  'erc721-interface': 'Incorrect ERC721 interfaces',
  'locked-ether': 'Contracts that lock ether',
  'tx-origin': 'Dangerous usage of tx.origin',
  'unchecked-transfer': 'Unchecked tokens transfer',
  'arbitrary-send-eth': 'Functions that send Ether to arbitrary destinations',
  'arbitrary-send-erc20': 'transferFrom uses arbitrary from',
  'arbitrary-send-erc20-permit': 'transferFrom uses arbitrary from with permit',
  'reentrancy-no-eth': 'Reentrancy vulnerabilities (theft of ethers)',
  'reentrancy-benign': 'Benign reentrancy vulnerabilities',
  'reentrancy-events': 'Reentrancy vulnerabilities leading to out-of-order Events',
};

export const NA_TOKEN_LABEL = 'N/A Token';
export const NA_COLLECTION_LABEL = 'N/A Collection';

export const COLLECTION_ALERT_STUB_LABEL = 'Collection risks';
export const TOKEN_ALERT_STUB_LABEL = 'Token risks';

export const NO_COLLECTION_LABEL = 'No collection name';
