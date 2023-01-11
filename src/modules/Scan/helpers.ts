import { HardcodedLogicData } from 'components/Risks/HardcodedLogic/interfaces';
import { RisksData } from 'components/Risks/interfaces';
import { SuspiciousActivityData } from 'components/Risks/SuspiciousActivity/interfaces';
import { TECHNICAL_RISKS } from 'components/Risks/TechnicalRisks/constants';
import { TechnicalRisksData } from 'components/Risks/TechnicalRisks/interfaces';
import { VulnerableCodeDetectorsData } from 'components/Risks/VulnerableCodeDetectors/interfaces';
import { SwapPart, SwapToken } from 'components/SwapInfo/interfaces';
import { RISK_TYPE } from 'constants/risks.constants';
import {
  MIN_ERC_20_LENGTH_FOR_APPROVE_ALL, PAYMENT_TOKENS, TOKEN_TYPES, TOKEN_TYPES_LABELS,
} from 'constants/token.constants';
import { fromWei } from 'helpers/big-number.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import {
  AnalyzeTransactionResponse, ContractAnalysisDTO, TokenEntity,
  TransferMethodDescriptor, Web3ContractEntity, Web3ContractEntityDTO,
} from 'interfaces/analyze.interfaces';
import { groupBy, sortBy } from 'lodash';
import ethIcon from 'assets/images/icons/eth-icon.svg';

import { ImageSize } from 'services/token/shared/enums';
import { tokenService } from 'services/token/token.service';
import { getNftName, isNull } from 'helpers/common.helpers';
import { Trace, TraceWithRisk } from 'types/fetch.type';
import {
  AnalysisStatusesForRandom,
  ANALYSIS_STATUSES,
  CODE_DETECTORS_INFO,
  COLLECTION_ALERT_STUB_LABEL,
  NA_COLLECTION_LABEL,
  NA_TOKEN_LABEL,
  RISK_ALERT_TEXTS,
  SITE_ANALYSIS_INFO,
  STATUS_DURATION_SECONDS,
  TOKEN_ALERT_STUB_LABEL,
  VERIFIED_CONTRACT_DESCRIPTION,
} from './constants';
import { ApprovesDetails, SwapDetails, TransactionDetailsData } from './interfaces';
import { HighlightAlert, ProtocolRisks } from './ScanningResult/interfaces';

export const getStatuses = (
  callback: (status: AnalysisStatusesForRandom) => void,
): void => {
  const statuses: Array<AnalysisStatusesForRandom> = [
    ANALYSIS_STATUSES.TRACING,
    ANALYSIS_STATUSES.SEARCHING,
    ANALYSIS_STATUSES.SCANNING,
  ];

  const statusPromise = async (value: AnalysisStatusesForRandom) => new Promise((resolve) => {
    const { from, to }: { from: number; to: number } = STATUS_DURATION_SECONDS[value];
    const timeout = (Math.random() * (to - from) + from) * 1000;

    setTimeout(() => {
      callback(value);
      resolve(null);
    }, timeout);
  });

  // eslint-disable-next-line no-void
  void statuses.reduce(
    // eslint-disable-next-line no-void
    (acc: Promise<unknown>, value: AnalysisStatusesForRandom) => acc.then(() => void statusPromise(value)),
    Promise.resolve().catch(() => null),
  );
};

export const getTraceWithRisks = (data: AnalyzeTransactionResponse): TraceWithRisk[] => {
  const { trace, contractsAnalysis } = data;
  const traceData = trace.map((traceItem: Trace) => {
    const risk = contractsAnalysis.find((contractsAnalyze) => contractsAnalyze.address === traceItem.method.address)?.risk || 0;

    return ({ ...traceItem, risk });
  });

  return traceData;
};

export const getMaxRiskContract = (data: AnalyzeTransactionResponse): { risk: RISK_TYPE; contract: ContractAnalysisDTO } => {
  const maxRiskContract = data.contractsAnalysis.reduce(
    (prev, contract) => (contract.risk > prev?.risk ? contract : (prev || contract)),
  );

  const riskValue = maxRiskContract.risk;
  let risk = RISK_TYPE.CRITICAL;

  if (riskValue <= 40) risk = RISK_TYPE.LOW;
  if (riskValue > 40 && riskValue < 70) risk = RISK_TYPE.MIDDLE;
  return { risk, contract: maxRiskContract };
};

export const getAnalyticsData = (data: AnalyzeTransactionResponse): { risk: RISK_TYPE; contract: ContractAnalysisDTO } => {
  const { risk, contract } = getMaxRiskContract(data);
  return { risk, contract };
};

const getContractTechnicalRisks = (data: ContractAnalysisDTO): TechnicalRisksData => {
  const detectors = { ...data?.code?.service2?.detectors || {} };

  return ({
    [TECHNICAL_RISKS.CONTRACT_CODE]: detectors.code_hash_changed,
    [TECHNICAL_RISKS.DELEGATE_CALL]: detectors.contains_delegatecall,
    [TECHNICAL_RISKS.DEPLOYED_BY_CONTRACT]: detectors.deployed_by_contract,
    [TECHNICAL_RISKS.METAMORPHIC_CODE]: detectors.contains_metamorphic_init_code,
    [TECHNICAL_RISKS.PRE_DETERMINED_ADDRESS]: detectors.deployer_contains_create2,
    [TECHNICAL_RISKS.SELF_DESTRUCT]: detectors.contains_selfdestruct,
  });
};

const getContractSuspiciousActivities = (data: ContractAnalysisDTO): SuspiciousActivityData => {
  const activities = data?.scam?.service2?.payload || [];

  const groupedActivities = groupBy(activities, 'tag');

  const result = Object.keys(groupedActivities).map((activity) => {
    const datesArr = sortBy(groupedActivities[activity], (item) => new Date(Number(item.timestamp) * 1000));
    const date = new Date(Number(datesArr[0].timestamp) * 1000).toISOString();
    return ({
      date,
      text: activity,
      count: groupedActivities[activity].length,
    });
  });

  return result;
};

const getContractHardcodedAddresses = (data: ContractAnalysisDTO): HardcodedLogicData => {
  const hardcodedAddresses = data?.code?.service3?.success
    ? data?.code?.service3?.payload?.hardcodedAddresses.map(({ content }) => content) : [];
  return hardcodedAddresses as HardcodedLogicData;
};

const getContractVulnerableCodeDetectors = (data: ContractAnalysisDTO): VulnerableCodeDetectorsData => {
  const detectors = data?.code?.service1?.detectors || [];
  return detectors.map(({ check }) => ({ name: check, info: CODE_DETECTORS_INFO[check] }));
};

const getContractRisks = (data: ContractAnalysisDTO): { count: number; risks: RisksData } => {
  const technicalRisksData = getContractTechnicalRisks(data);
  const technicalRisksCount = Object.values(technicalRisksData).filter((risk) => risk).length;

  const suspiciousActivityData = getContractSuspiciousActivities(data);
  const suspiciousActivityCount = suspiciousActivityData.length;

  const vulnerableCodeDetectorsData = getContractVulnerableCodeDetectors(data);
  const vulnerableCodeDetectorsCount = vulnerableCodeDetectorsData.length;

  const hardcodedAddressesData = getContractHardcodedAddresses(data);
  const hardcodedAddressesCount = hardcodedAddressesData.length;

  const count = technicalRisksCount
  // + suspiciousActivityCount
  + vulnerableCodeDetectorsCount
  + hardcodedAddressesCount;

  return ({
    count,
    risks: {
      technicalRisks: { count: technicalRisksCount, data: technicalRisksData },
      suspiciousActivity: { count: suspiciousActivityCount, data: suspiciousActivityData },
      vulnerableCodeDetectors: { count: vulnerableCodeDetectorsCount, data: vulnerableCodeDetectorsData },
      hardcodedLogic: { count: hardcodedAddressesCount, data: hardcodedAddressesData },
    },
  });
};

export const getApproves = (data: AnalyzeTransactionResponse): ApprovesDetails[] => {
  const {
    traceOperations, contractsAnalysis, tokens, contracts,
  } = data;

  const details = traceOperations.approves.map((operation) => {
    const hasRisk = !contracts.find((contract) => operation.to === contract.address);
    const address = operation.to;

    if (operation.value === null) {
      return {
        hasRisk,
        address,
        approvedAsset: 'All of your NFTs and Tokens',
      };
    }

    const nftData = tokens.find((token) => token.contractAddress === operation.contractAddress);

    if (nftData) {
      return {
        hasRisk,
        address,
        approvedAsset: getNftName(nftData.externalId, nftData.name),
      };
    }

    const tokenData = contractsAnalysis.find((contract) => contract.address === operation.contractAddress);

    if (tokenData) {
      const contractData = contracts.find((contract) => operation.contractAddress === contract.address);
      const isAllAssets = String(operation.value).length >= MIN_ERC_20_LENGTH_FOR_APPROVE_ALL;
      const tokenSymbol = tokenData.contract.symbol || NA_TOKEN_LABEL;

      return {
        hasRisk,
        address,
        approvedAsset: isAllAssets
          ? `All of your ${tokenSymbol}`
          : `${fromWei(operation.value || 0, isNull(contractData?.decimals) ? 18 : Number(contractData?.decimals))} ${tokenSymbol}`,
      };

    }

    return null;
  }).filter((item) => item);

  return details as ApprovesDetails[];
};

export const getRisks = (data: AnalyzeTransactionResponse, projectAddress: string): ProtocolRisks[] => {
  const { activeProjectId } = data;

  const getProjectsRisks = () => {
    const contractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
      (contractAnalyze) => contractAnalyze.address === projectAddress,
    );

    if (!contractData) {
      return [];
    }
    const projectData = data.projects.find(
      (project) => (project.id === contractData.contract.projectId),
    );

    const isVerified = activeProjectId === projectData?.id && contractData.verified;

    const isToken = !!data.tokens.find((token) => token.contractAddress === projectAddress);
    const isCollection = !!data.collections.find((collection) => collection.contractAddress === projectAddress);

    if (isToken || isCollection) {
      return [];
    }

    const name = contractData.contract.type === Web3ContractEntity.type.ERC20 ? contractData.contract.name : projectData?.name;

    const { risks, count } = getContractRisks(contractData);

    const riskItem: ProtocolRisks = {
      risk: contractData.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
      isVerified,
      name: name || window.location.hostname,
      description: isVerified ? VERIFIED_CONTRACT_DESCRIPTION : '',
      risksCount: isVerified ? 0 : count,
      data: risks,
      contract: contractData,
      label: contractData.contract.type === Web3ContractEntity.type.ERC20 ? TOKEN_TYPES_LABELS[TOKEN_TYPES.ERC20] : undefined,
    };

    return [riskItem];
  };

  const collectionRisks = data.collections.reduce((acc: ProtocolRisks[], collection) => {
    const isIncluded = data.traceOperations.to.some((traceOperation) => traceOperation.contractAddress === collection.contractAddress);

    if (!isIncluded) { return acc; }
    const contractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
      (contractAnalyze) => contractAnalyze.contract?.address === collection.contractAddress,
    );

    if (!contractData) {
      return acc;
    }

    const { risks, count } = getContractRisks(contractData);

    const name = collection.name || COLLECTION_ALERT_STUB_LABEL;

    const riskItem: ProtocolRisks = {
      risk: contractData.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
      name,
      risksCount: count,
      data: risks,
      contract: contractData,
      label: 'Collection',
    };

    return [...acc, riskItem];
  }, []);

  const erc20Risks = data.contractsAnalysis
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .filter((contractAnalyze) => contractAnalyze.contract.type === Web3ContractEntity.type.ERC20)
    .reduce((acc: ProtocolRisks[], contractAnalyze) => {
      const isIncluded = data.traceOperations.to.some(
        (traceOperation) => traceOperation.contractAddress === contractAnalyze.address,
      );

      if (!isIncluded) { return acc; }
      const name = contractAnalyze.contract.name || TOKEN_ALERT_STUB_LABEL;
      const { risks, count } = getContractRisks(contractAnalyze);

      const alert: ProtocolRisks = {
        risk: contractAnalyze.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
        name,
        risksCount: count,
        label: TOKEN_TYPES_LABELS[TOKEN_TYPES.ERC20],
        data: risks,
        contract: contractAnalyze,
      };

      return [...acc, alert];
    }, []);

  return [...getProjectsRisks(), ...collectionRisks, ...erc20Risks];
};

export const getAlerts = (data: AnalyzeTransactionResponse,
  projectAddress: string): {alerts: HighlightAlert[]; hasSimulationAlert: boolean} => {
  const { risk } = getMaxRiskContract(data);
  const riskAlert: HighlightAlert = {
    risk,
    text: RISK_ALERT_TEXTS[risk],
  };

  const getProjectsAlert = () => {
    const contractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
      (contractAnalyze) => contractAnalyze.address === projectAddress,
    );

    if (!contractData) {
      return [];
    }
    const isToken = !!data.tokens.find((token) => token.contractAddress === projectAddress);
    const isCollection = !!data.collections.find((collection) => collection.contractAddress === projectAddress);

    if (isToken || isCollection) {
      return [];
    }

    const projectData = data.projects.find(
      (project) => (project.id === contractData.contract.projectId),
    );

    const name = contractData.contract.type === Web3ContractEntity.type.ERC20 ? contractData.contract.name : projectData?.name;

    const alert: HighlightAlert = {
      risk: contractData.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
      contract: {
        verified: contractData.verified,
        name: name || window.location.hostname,
      },
    };

    return [alert];
  };

  const collectionsAlerts = data.collections.reduce((acc: HighlightAlert[], collection) => {
    const isIncluded = data.traceOperations.to.some((traceOperation) => traceOperation.contractAddress === collection.contractAddress);

    if (!isIncluded) { return acc; }

    const contractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
      (contractAnalyze) => contractAnalyze.contract?.address === collection.contractAddress,
    );

    if (!contractData) {
      return acc;
    }

    const alert: HighlightAlert = {
      risk: contractData.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
      contract: {
        verified: contractData.verified,
        name: collection.name || NA_COLLECTION_LABEL,
      },
    };

    return [alert, ...acc];
  }, []);

  const erc20Alerts = data.contractsAnalysis
    .filter((contractAnalyze) => contractAnalyze.contract.type === Web3ContractEntity.type.ERC20)
    .reduce((acc: HighlightAlert[], contractAnalyze) => {
      const isIncluded = data.traceOperations.to.some(
        (traceOperation) => traceOperation.contractAddress === contractAnalyze.address,
      );

      if (!isIncluded) { return acc; }

      const alert: HighlightAlert = {
        risk: contractAnalyze.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
        contract: {
          verified: contractAnalyze.verified,
          name: contractAnalyze.contract.name || NA_TOKEN_LABEL,
        },
      };

      return [...acc, alert];
    }, []);

  const approvedAlerts = getApproves(data).map(({ hasRisk, approvedAsset }) => ({
    risk: hasRisk ? RISK_TYPE.CRITICAL : RISK_TYPE.LOW,
    text: `Approved assets: ${approvedAsset}`,
  }));

  const { risk: websiteRisk, text } = SITE_ANALYSIS_INFO[data.siteAnalysis.status];
  const websiteAlert: HighlightAlert = {
    risk: websiteRisk,
    text,
  };

  const hasSimulationAlert = data.contractsAnalysis.some(
    (contractAnalyze) => contractAnalyze.risk > 40,
  );
  const simulationAlert = hasSimulationAlert ? [{ risk: RISK_TYPE.CRITICAL, simulation: getTraceWithRisks(data) }] : [];

  const alerts = [
    ...getProjectsAlert(), ...collectionsAlerts, ...erc20Alerts, ...approvedAlerts, websiteAlert, riskAlert, ...simulationAlert,
  ];

  return { alerts, hasSimulationAlert };
};

export const getRisksSum = (data: RisksData): number => data.technicalRisks.count
  // + data.suspiciousActivity.count
  + data.hardcodedLogic.count
  + data.vulnerableCodeDetectors.count;

const getOperationsData = (
  operations: TransferMethodDescriptor[],
  tokens: TokenEntity[],
  contractsAnalysis: ContractAnalysisDTO[],
  contracts: Web3ContractEntityDTO[],
): Array<SwapPart | null> => operations.map((operation) => {
  const nftData = tokens.find((token) => token.contractAddress === operation.contractAddress);

  if (nftData) {
    const image = tokenService.getPreviewURL(
      {
        previewURL: nftData.url,
        croppedPreviewURL: nftData.croppedPreviewURL,
        animatedPreviewURL: nftData.animationUrl,
        size: ImageSize.Size560,
      },
      true,
    );

    return {
      isToken: false,
      item: {
        address: nftData.contractAddress,
        id: nftData.externalId,
        name: nftData.name,
        image,
        count: operation.amount || 1,
      },
    };
  }

  const tokenData = contractsAnalysis.find((contract) => contract.address === operation.contractAddress);
  if (tokenData) {
    const contractData = contracts.find((contract) => contract.address === operation.contractAddress);
    const amount = fromWei(operation.value, isNull(contractData?.decimals) ? 18 : Number(contractData?.decimals));

    return {
      isToken: true,
      item: {
        name: tokenData.contract.symbol || NA_TOKEN_LABEL,
        image: tokenData.contract.imgURL,
        amount,
      },
    };
  }

  return null;
});

export const getSwapDetails = (data: AnalyzeTransactionResponse): SwapDetails => {
  const {
    traceOperations, tokens, contractsAnalysis, contracts,
  } = data;
  const ethFromToken: SwapToken | null = Number(traceOperations.eth)
    ? { amount: fromWei(traceOperations.eth), name: PAYMENT_TOKENS.ETH, image: getImageUrl(ethIcon) } : null;
  const ethFrom: SwapPart | null = ethFromToken ? { isToken: true, item: ethFromToken } : null;

  const income = getOperationsData(traceOperations.to, tokens, contractsAnalysis, contracts).filter((item) => item) as SwapPart[];
  const loss = getOperationsData(traceOperations.from, tokens, contractsAnalysis, contracts).filter((item) => item) as SwapPart[];

  return ({ loss: [...(ethFrom ? [ethFrom] : []), ...loss], income: [...income] });
};

export const getTransactionsDetails = (data: AnalyzeTransactionResponse): TransactionDetailsData => ({
  swap: getSwapDetails(data),
  permissionRequest: getApproves(data),
});
