/* eslint-disable max-len */
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

export const ANALYSIS_RANDOM_STATUSES: Array<AnalysisStatusesForRandom> = [
  ANALYSIS_STATUSES.TRACING,
  ANALYSIS_STATUSES.SEARCHING,
  ANALYSIS_STATUSES.SCANNING,
];

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
    text: 'is not flagged by W3A',
  },
  [ProjectAnalysisStatus.Dangerous]: {
    risk: RISK_TYPE.CRITICAL,
    text: 'blocklisted by W3A',
  },
  [ProjectAnalysisStatus.Suspicious]: {
    risk: RISK_TYPE.CRITICAL,
    text: 'blocklisted by W3A',
  },
  [ProjectAnalysisStatus.Validated]: {
    risk: RISK_TYPE.LOW,
    text: 'whitelisted by W3A',
  },
};

export const VERIFIED_CONTRACT_DESCRIPTION = 'The contract is in the W3A whitelist. You can trust it.';
export const NOT_VERIFIED_CONTRACT_DESCRIPTION = 'The contract is not verified.';
export const NOT_VERIFIED_CONTRACT_HEADER_DESCRIPTION = 'The contract is not verified, that\'s why W3A can\'t specify all the risks it may have.';

export const CODE_DETECTORS_INFO: { [x: string]: string } = {
  'abiencoderv2-array': 'Storage abiencoderv2 array',
  'arbitrary-send-erc20': 'transferFrom uses arbitrary from',
  'array-by-reference': 'Modifying storage array by value',
  'incorrect-shift': 'The order of parameters in a shift instruction is incorrect.',
  'multiple-constructors': 'Multiple constructor schemes',
  'name-reused': "Contract's name reused",
  'protected-vars': 'Detected unprotected variables',
  'public-mappings-nested': 'Public mappings with nested variables',
  rtlo: 'Right-To-Left-Override control character is used',
  'shadowing-state': 'State variables shadowing',
  suicidal: 'Functions allowing anyone to destruct the contract',
  'uninitialized-state': 'Uninitialized state variables',
  'uninitialized-storage': 'Uninitialized storage variables',
  'unprotected-upgrade': 'Unprotected upgradeable contract',
  codex: 'Use Codex to find vulnerabilities.',
  'arbitrary-send-erc20-permit': 'transferFrom uses arbitrary from with permit',
  'arbitrary-send-eth': 'Functions that send Ether to arbitrary destinations',
  'controlled-array-length': 'Tainted array length assignment',
  'controlled-delegatecall': 'Controlled delegatecall destination',
  'delegatecall-loop': 'Payable functions using delegatecall inside a loop',
  'msg-value-loop': 'msg.value inside a loop',
  'reentrancy-eth': 'Reentrancy vulnerabilities (theft of ethers)',
  'storage-array': 'Signed storage integer array compiler bug',
  'unchecked-transfer': 'Unchecked tokens transfer',
  'weak-prng': 'Weak PRNG',
  'domain-separator-collision': "Detects ERC20 tokens that have a function whose signature collides with EIP-2612's DOMAIN_SEPARATOR()",
  'enum-conversion': 'Detect dangerous enum conversion',
  'erc20-interface': 'Incorrect ERC20 interfaces',
  'erc721-interface': 'Incorrect ERC721 interfaces',
  'incorrect-equality': 'Dangerous strict equalities',
  'locked-ether': 'Contracts that lock ether',
  'mapping-deletion': 'Deletion on mapping containing a structure',
  'shadowing-abstract': 'State variables shadowing from abstract contracts',
  tautology: 'Tautology or contradiction',
  'write-after-write': 'Unused write',
  'boolean-cst': 'Misuse of Boolean constant',
  'constant-function-asm': 'Constant functions using assembly code',
  'constant-function-state': 'Constant functions changing the state',
  'divide-before-multiply': 'Imprecise arithmetic operations order',
  'reentrancy-no-eth': 'Reentrancy vulnerabilities (no theft of ethers)',
  'reused-constructor': 'Reused base constructor',
  'tx-origin': 'Dangerous usage of tx.origin',
  'unchecked-lowlevel': 'Unchecked low-level calls',
  'unchecked-send': 'Unchecked send',
  'uninitialized-local': 'Uninitialized local variables',
  'unused-return': 'Unused return values',
  'incorrect-modifier': 'Modifiers that can return the default value',
  'shadowing-builtin': 'Built-in symbol shadowing',
  'shadowing-local': 'Local variables shadowing',
  'uninitialized-fptr-cst': 'Uninitialized function pointer calls in constructors',
  'variable-scope': 'Local variables used prior their declaration',
  'void-cst': 'Constructor called not implemented',
  'calls-loop': 'Multiple calls in a loop',
  'events-access': 'Missing Events Access Control',
  'events-maths': 'Missing Events Arithmetic',
  'incorrect-unary': 'Dangerous unary expressions',
  'missing-zero-check': 'Missing Zero Address Validation',
  'reentrancy-benign': 'Benign reentrancy vulnerabilities',
  'reentrancy-events': 'Reentrancy vulnerabilities leading to out-of-order Events',
  timestamp: 'Dangerous usage of block.timestamp',
  assembly: 'Assembly usage',
  'assert-state-change': 'Assert state change',
  'boolean-equal': 'Comparison to boolean constant',
  'deprecated-standards': 'Deprecated Solidity Standards',
  'erc20-indexed': 'Un-indexed ERC20 event parameters',
  'function-init-state': 'Function initializing state variables',
  'low-level-calls': 'Low level calls',
  'missing-inheritance': 'Missing inheritance',
  'naming-convention': 'Conformity to Solidity naming conventions',
  pragma: 'If different pragma directives are used',
  'redundant-statements': 'Redundant statements',
  'solc-version': 'Incorrect Solidity version',
  'unimplemented-functions': 'Unimplemented functions',
  'unused-state': 'Unused state variables',
  'costly-loop': 'Costly operations in a loop',
  'dead-code': 'Functions that are not used',
  'reentrancy-unlimited-gas': 'Reentrancy vulnerabilities through send and transfer',
  'similar-names': 'Variable names are too similar',
  'too-many-digits': 'Conformance to numeric notation best practices',
  'constable-states': 'State variables that could be declared constant',
  'external-function': 'Public function that could be declared external',
  'immutable-states': 'State variables that could be declared immutable',
  'var-read-using-this': 'Contract reads its own variable using this',
};

export const NA_TOKEN_LABEL = 'N/A Token';
export const NA_COLLECTION_LABEL = 'N/A Collection';

export const COLLECTION_ALERT_STUB_LABEL = 'Collection risks';
export const TOKEN_ALERT_STUB_LABEL = 'Token risks';

export const NO_COLLECTION_LABEL = 'No collection name';

export enum DANGER_MESSAGES {
  BALANCE_CHANGE_BY_CONTRACT = 'BALANCE_CHANGE_BY_CONTRACT',
  BALANCE_LOCKED = 'BALANCE_LOCKED',
  HONEYPOT_SCAM_ERC_20 = 'HONEYPOT_SCAM_ERC_20',
  HONEYPOT_SCAM_ERC_721 = 'HONEYPOT_SCAM_ERC_721',
  TRANSFER_RESTRICTION = 'TRANSFER_RESTRICTION',
  OWNER_PERMISSIONS = 'OWNER_PERMISSIONS',
  BURN_TOKENS = 'BURN_TOKENS',
}

export const DANGER_MESSAGES_DATA = {
  [DANGER_MESSAGES.BALANCE_CHANGE_BY_CONTRACT]: {
    title: 'Token balance access extension',
    message: 'Contract creator will get access to all your ERC-20 tokens and will be able to transfer them without any notification.',
  },
  [DANGER_MESSAGES.BALANCE_LOCKED]: {
    title: 'Token transfer restriction',
    message: 'The contract can disallow token transfer if you have an excessive amount of tokens on your balance.',
  },
  [DANGER_MESSAGES.HONEYPOT_SCAM_ERC_20]: {
    title: 'Honeypot scam detection',
    message: 'This ERC-20 token may have restrictions that prevent its further transfer and resale. Proceed with caution and research before investing.',
  },
  [DANGER_MESSAGES.HONEYPOT_SCAM_ERC_721]: {
    title: 'Honeypot scam detection',
    message: 'This NFT may have restrictions that prevent its further transfer and resale. Proceed with caution and research before investing.',
  },
  [DANGER_MESSAGES.TRANSFER_RESTRICTION]: {
    title: 'Transaction restriction',
    message: 'Contract owner can forbid you to proceed with the transaction.',
  },
  [DANGER_MESSAGES.OWNER_PERMISSIONS]: {
    title: 'ERC-20 token allowance',
    message: 'Contract creator will get access to all your ERC-20 tokens and will be able to transfer them without any notification.',
  },
  [DANGER_MESSAGES.BURN_TOKENS]: {
    title: 'Burnable tokens',
    message: 'Contract owner has the ability to burn your tokens.',
  },
};

export enum WARNING_MESSAGES {
  TRADING_COOLDOWN = 'TRADING_COOLDOWN',
}

export const WARNING_MESSAGES_DATA = {
  [WARNING_MESSAGES.TRADING_COOLDOWN]: {
    title: 'Trading cooldown',
    message: 'The contract has the ability to restrict the number of transactions for some period of time.',
  },
};

export const FOUNDATION_MAKE_OFFER_METHOD_NAME = 'makeOfferV2';
export const FOUNDATION_PLACE_BID_METHOD_NAME = 'placeBidV2';
