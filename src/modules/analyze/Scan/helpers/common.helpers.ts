import { AUDITS } from 'components/ContractAudits/constants';
import { RISK_TYPE } from 'constants/risks.constants';
import { AnalyzeTransactionResponse, ProjectAnalysisStatus } from 'interfaces/analyze.interfaces';
import { AuditsData } from 'modules/analyze/Scan/interfaces';
import unknownIcon from 'assets/images/icons/unknown-icon.svg';
import { SITE_ANALYSIS_INFO } from '../constants';
import { IHighlightAlert } from '../ScanningResult/interfaces';

export const getAuditsByContract = (data: AnalyzeTransactionResponse, contractAddress: string): AuditsData => {
  const audits = data.audits.filter((audit) => audit.address === contractAddress);
  const result = audits.reduce((acc, audit) => {
    const auditor = (audit.auditor || '').toLowerCase();
    if (Object.values(AUDITS).includes(auditor as AUDITS)) {
      return ({
        ...acc,
        [auditor]: audit.auditUrl,
      });
    } return acc;
  }, {} as AuditsData);

  return result;
};

export const getWebsiteAlertByStatus = (status: ProjectAnalysisStatus): IHighlightAlert => {
  const { risk: websiteRisk, text } = SITE_ANALYSIS_INFO[status];
  const websiteAlert: IHighlightAlert = {
    risk: websiteRisk,
    icon: websiteRisk === RISK_TYPE.MIDDLE ? unknownIcon : undefined,
    website: {
      name: window.location.hostname || '',
      text,
    },
  };

  return websiteAlert;
};
