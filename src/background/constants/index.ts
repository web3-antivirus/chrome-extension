export const TURN_ON_ICONS = {
  path: {
    16: '/icon16.png',
    32: '/icon32.png',
    48: '/icon48.png',
    128: '/icon128.png',
  },
};

export const TURN_OFF_ICONS = {
  path: {
    16: '/icon16red.png',
    32: '/icon32red.png',
    48: '/icon48red.png',
    128: '/icon128red.png',
  },
};

export const DEFAULT_PAUSE_VALUE = {
  isPaused: false,
  pauseUntilTime: null,
};

export const METAMASK_ORIGINAL_DATA = {
  id: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
  shortName: 'MetaMask',
};

export const SITE_STATUSES = {
  SUSPICIOUS: 'suspicous',
  DANGEROUS: 'dangerous',
  NEUTRAL: 'neutral',
};

export const SAFE_TLDS = ['com', 'net', 'io', 'xyz', 'org'];
export const BROWSER = process.env.REACT_APP_BROWSER;
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
