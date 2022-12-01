export const ALERT_ERRORS = {
  ETH_SIGN: 'ETH_SIGN',
};

export const ALERT_TEXTS = {
  [ALERT_ERRORS.ETH_SIGN]: {
    title: 'Suspicious activity',
    description: (
      <span>
        We detected <b>eth_sign</b> code that can let third parties get control
        over your assets. We recommend you to discontinue signing.
      </span>
    ),
  },
};
