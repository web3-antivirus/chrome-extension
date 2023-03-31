import { AUDITS } from 'components/ContractAudits/constants';
import { SOCIALS } from 'components/Socials/constants';
import { TSocials } from 'components/Socials/interfaces';
import { RISK_TYPE } from 'constants/risks.constants';
import { TOKEN_TYPES, TOKEN_TYPES_LABELS } from 'constants/token.constants';
import {
  fromHexToString,
  fromWei,
} from 'helpers/big-number.helpers';
import {
  ContractAnalysisDTO, ProjectAnalysisStatus, SECURITY_LEVEL, Web3ContractAuditEntity,
} from 'interfaces/analyze.interfaces';
import { getContractRisks } from 'modules/analyze/helpers/contract.helpers';
import { NA_TOKEN_LABEL, NOT_VERIFIED_CONTRACT_DESCRIPTION, TOKEN_ALERT_STUB_LABEL } from 'modules/analyze/Scan/constants';
import { getWebsiteAlertByStatus } from 'modules/analyze/Scan/helpers/common.helpers';
import { AuditsData, MintingData, TokenData } from 'modules/analyze/Scan/interfaces';
import { IHighlightAlert, ProtocolRisks } from 'modules/analyze/Scan/ScanningResult/interfaces';

const getTokenAlerts = (contractAnalyze: ContractAnalysisDTO, siteStatus: ProjectAnalysisStatus): IHighlightAlert[] => {
  const erc20Alert: IHighlightAlert = {
    risk: contractAnalyze.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
    contract: {
      verified: contractAnalyze.verified,
      name: contractAnalyze.contract.name || NA_TOKEN_LABEL,
    },
  };

  const urlAlert = getWebsiteAlertByStatus(siteStatus);

  return [erc20Alert, urlAlert];
};

export const getTokenData = (
  contractAnalyze: ContractAnalysisDTO,
  contractAuditsData: Web3ContractAuditEntity[],
  siteStatus: ProjectAnalysisStatus,
): {tokenData: TokenData, contractData: ProtocolRisks, alerts: IHighlightAlert[]} => {

  const name = contractAnalyze.contract.name || TOKEN_ALERT_STUB_LABEL;
  const { risks, count } = getContractRisks(contractAnalyze);

  const contractData: ProtocolRisks = {
    risk: contractAnalyze.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
    name,
    risksCount: count,
    label: TOKEN_TYPES_LABELS[TOKEN_TYPES.ERC20],
    data: risks,
    contract: contractAnalyze,
    description: contractAnalyze.verified ? '' : NOT_VERIFIED_CONTRACT_DESCRIPTION,
  };

  const minting: MintingData | undefined = (
    contractAnalyze?.code?.service4?.success && contractAnalyze?.code?.service4?.payload?.hasMint) ? {
      cap: contractAnalyze.code.service4?.payload?.cap ? fromWei(
        fromHexToString(contractAnalyze.code.service4.payload.cap), contractAnalyze.contract.decimals || 18,
      ) : null,
      total: contractAnalyze.code.service4?.payload?.totalSupply ? fromWei(
        fromHexToString(contractAnalyze.code.service4.payload.totalSupply),
        contractAnalyze.contract.decimals || 18,
      ) : null,
    } : undefined;

  const socialsData = contractAnalyze?.contract.socials;
  const socials: TSocials = {
    [SOCIALS.TWITTER]: socialsData?.twitter,
    [SOCIALS.DISCORD]: socialsData?.discord,
    [SOCIALS.WEBSITE]: socialsData?.site,
  };

  const audits = contractAuditsData.reduce((acc, audit) => {
    const auditor = (audit.auditor || '').toLowerCase();
    if (Object.values(AUDITS).includes(auditor as AUDITS)) {
      return ({
        ...acc,
        [auditor]: audit.auditUrl,
      });
    } return acc;
  }, {} as AuditsData);

  const info = {
    isProxy: contractAnalyze?.proxy,
    socials,
    ...minting ? { minting } : {},
    audits,
    name,
    isAddressVerified: contractAnalyze?.verified,
    address: contractAnalyze?.address,
    symbol: contractAnalyze?.contract?.symbol,
    imageUrl: contractAnalyze?.contract?.imgURL,
    transactionsCount: contractAnalyze?.numOfTransactions,
    createdAt: contractAnalyze?.createdAt,
    hasRisk: contractAnalyze?.contract?.securityLevel === SECURITY_LEVEL.BLACKLIST,
  };

  return ({
    tokenData: { risks, info },
    contractData,
    alerts: getTokenAlerts(contractAnalyze, siteStatus),
  });
};
