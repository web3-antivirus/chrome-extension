import { RISK_TYPE } from 'constants/risks.constants';

export const getRiskTypeFromRisk = (risk: number): RISK_TYPE => {
  if (risk < 40) return RISK_TYPE.LOW;
  if (risk >= 40 && risk < 70) return RISK_TYPE.MIDDLE;
  return RISK_TYPE.CRITICAL;
};

const RISK_TEXTS = {
  [RISK_TYPE.LOW]: 'Low risk detected',
  [RISK_TYPE.MIDDLE]: 'Medium risk detected',
  [RISK_TYPE.CRITICAL]: 'High risk detected',
};

export const getRiskInfoFromRisk = (risk: number): { hasRisk: boolean; text: string; } => {
  const riskType = getRiskTypeFromRisk(risk);
  const text = RISK_TEXTS[riskType];

  return ({
    hasRisk: riskType !== RISK_TYPE.LOW,
    text,
  });
};
