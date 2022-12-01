export const NOTIFICATION_ERROR_TYPES = {
  MALICIOUS_METAMASK: 'MALICIOUS_METAMASK',
};

export const NOTIFICATIONS_TEXTS = {
  [NOTIFICATION_ERROR_TYPES.MALICIOUS_METAMASK]: {
    title: 'Disabled extension: MetaMask',
    description: 'Potencially malicious extension',
  },
};

export const RESPONSE_ERRORS = {
  FAILED: 'Failed to get data',
  INVALID_CODE: 'Invalid code',
};
