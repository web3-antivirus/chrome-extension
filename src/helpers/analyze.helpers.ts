import { RISK_TYPE } from 'constants/risks.constants';

export const getRiskTypeFromRisk = (risk: number): RISK_TYPE => {
  if (risk <= 40) return RISK_TYPE.LOW;
  if (risk > 40 && risk < 70) return RISK_TYPE.MIDDLE;
  return RISK_TYPE.CRITICAL;
};
