export const CHECK_NFT_PATH = process.env.REACT_APP_CHECK_NFT_PATH || '';
export const CHECK_NFT_TOKEN_PATH = `${CHECK_NFT_PATH}token/`;
export const API_PROD_PATH = 'https://checknft.io/';

export const TOKEN_SHORT_INFO_API = `${CHECK_NFT_PATH}api/v1/nft/`;
export const CONTRACT_ANALYZER_API = `${CHECK_NFT_PATH}api/v1/contract-analyzer/`;
export const ANALYSIS = '/analysis';
export const EXTENSION_CONTRACT_API = `${CHECK_NFT_PATH}api/v1/extension/contract/`;
export const EXTENSION_CONTRACT_API_V2 = `${CHECK_NFT_PATH}api/v2/extension/analyze/transaction/`;
export const EXTENSION_NFTS_API = `${CHECK_NFT_PATH}api/v1/extension/nft/`;
export const EXTENSION_PAYMENT_TOKEN_API = `${CHECK_NFT_PATH}api/v1/extension/payment-token/`;
export const EXTENSION_GET_TOKEN = `${CHECK_NFT_PATH}api/v1/extension/token/`;
export const EXTENSION_INITIALIZE_PATH = 'api/v1/extension/initialize/';

export const EXTENSION_ACTION_API = `${CHECK_NFT_PATH}api/v1/extension/action`;

export const URL_ANALYZE_API = `${CHECK_NFT_PATH}api/v1/blockchain-project${ANALYSIS}`;
export const URL_WHITE_LIST = `${CHECK_NFT_PATH}api/v1/blockchain-project/whitelist`;
