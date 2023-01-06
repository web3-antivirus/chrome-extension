import noRisk from 'assets/images/icons/risks/no-risks-icon.svg';
import middleRisk from 'assets/images/icons/risks/middle-risk-icon.svg';
import criticalRisk from 'assets/images/icons/risks/critical-risk-icon.svg';

import alertLow from 'assets/images/icons/risks/alert-low.svg';
import alertMedium from 'assets/images/icons/risks/alert-medium.svg';
import alertHigh from 'assets/images/icons/risks/alert-high.svg';

export enum RISK_TYPE {
  LOW = 'LOW',
  MIDDLE = 'MIDDLE',
  CRITICAL = 'CRITICAL',
}

export const RISK_OPTIONS = {
  [RISK_TYPE.LOW]: {
    title: 'Low risk',
    icon: noRisk,
  },
  [RISK_TYPE.MIDDLE]: {
    title: 'Medium risk',
    icon: middleRisk,
  },
  [RISK_TYPE.CRITICAL]: {
    title: 'High risk',
    icon: criticalRisk,
  },
};

export const RISK_ALERT_ICONS = {
  [RISK_TYPE.LOW]: alertLow,
  [RISK_TYPE.MIDDLE]: alertMedium,
  [RISK_TYPE.CRITICAL]: alertHigh,
};
