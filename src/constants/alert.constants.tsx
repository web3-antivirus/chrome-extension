export const ALERT_ERRORS = {
  ETH_SIGN: 'ETH_SIGN',
};

export const ALERT_TEXTS = {
  [ALERT_ERRORS.ETH_SIGN]: {
    title: 'Please make sure this is not scam!',
    description: (
      <>
        We detected <span><b>eth_sign</b></span> code that can let third parties get control
        over your assets. We recommend you to discontinue signing.
      </>
    ),
  },
};

export const ALERT_TITLE = {
  SUSPICIOUS_ACTIVITY: 'Suspicious activity',
  MALICIOUS_EXTENSION: 'Potentially malicious extension',
};
