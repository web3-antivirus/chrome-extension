/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { RisksData } from 'components/Risks/interfaces';
import { SwapPart, SwapToken, SwapNft } from 'components/SwapInfo/interfaces';
import { RISK_TYPE } from 'constants/risks.constants';
import {
  MIN_ERC_20_LENGTH_FOR_APPROVE_ALL, PAYMENT_TOKENS, TOKEN_TYPES, TOKEN_TYPES_LABELS,
} from 'constants/token.constants';
import {
  fromWei, fromWeiWithoutFormat, getPercentFromValues, getPriceByAmount,
} from 'helpers/big-number.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import {
  AnalyzeTransactionResponse, ContractAnalysisDTO, SECURITY_LEVEL,
  TransferMethodDescriptor, Web3ContractEntity,
} from 'interfaces/analyze.interfaces';
import ethIcon from 'assets/images/icons/eth-icon.svg';
import questionIcon from 'assets/images/icons/question-round.svg';

import { ImageSize } from 'services/token/shared/enums';
import { tokenService } from 'services/token/token.service';
import { getNftName, isNull } from 'helpers/common.helpers';
import { Trace, TraceWithRisk } from 'types/fetch.type';
import { getContractRisks } from 'modules/analyze/helpers/contract.helpers';
import {
  AnalysisStatusesForRandom,
  ANALYSIS_STATUSES,
  COLLECTION_ALERT_STUB_LABEL,
  DANGER_MESSAGES,
  DANGER_MESSAGES_DATA,
  NA_COLLECTION_LABEL,
  NA_TOKEN_LABEL,
  NOT_VERIFIED_CONTRACT_DESCRIPTION,
  STATUS_DURATION_SECONDS,
  TOKEN_ALERT_STUB_LABEL,
  VERIFIED_CONTRACT_DESCRIPTION,
  WARNING_MESSAGES,
  WARNING_MESSAGES_DATA,
} from '../constants';
import {
  ApprovesDetails, MessageData, SwapDetails, TransactionDetailsData,
} from '../interfaces';
import { IHighlightAlert, ProtocolRisks } from '../ScanningResult/interfaces';
import { getWebsiteAlertByStatus } from './common.helpers';

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

export const getMaxRiskContract = (data: AnalyzeTransactionResponse, projectAddress: string):
{ risk: RISK_TYPE; contract: ContractAnalysisDTO } => {
  const maxRiskContract = data.contractsAnalysis.filter((contract) => contract.contract.securityLevel !== SECURITY_LEVEL.WHITELIST).reduce(
    (prev, contract) => (contract.risk > prev?.risk ? contract : (prev || contract)), ({ risk: 0 }) as ContractAnalysisDTO,
  );

  // logic only for verified projects
  const projectContractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
    (contractAnalyze) => contractAnalyze.address === projectAddress,
  );
  const projectData = data.projects.find(
    (project) => (project.id === projectContractData?.contract.projectId),
  );
  const isVerified = data.activeProjectId === projectData?.id && projectContractData?.verified;
  let riskValue = maxRiskContract.risk;

  if (isVerified) {
    const collectionRisks = data.collections.reduce((acc: number[], collection) => {
      const isIncluded = data.traceOperations.to.some((traceOperation) => traceOperation.contractAddress === collection.contractAddress);

      if (!isIncluded) { return acc; }
      const contractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
        (contractAnalyze) => contractAnalyze.contract?.address === collection.contractAddress,
      );

      if (!contractData) {
        return acc;
      }

      return [...acc, contractData.risk];
    }, []);

    const erc20Risks = data.contractsAnalysis
      .filter((contractAnalyze) => contractAnalyze.contract.type === Web3ContractEntity.type.ERC20)
      .reduce((acc: number[], contractAnalyze) => {
        const isIncluded = data.traceOperations.to.some(
          (traceOperation) => traceOperation.contractAddress === contractAnalyze.address,
        );

        if (!isIncluded) { return acc; }

        return [...acc, contractAnalyze.risk];
      }, []);

    const protocolRisk = data.contractsAnalysis
      .filter((item) => item.contract.type === null).reduce((sum, contract) => sum + contract.risk, 0) / data.contractsAnalysis.length;

    riskValue = Math.max(...erc20Risks, ...collectionRisks, protocolRisk);
  }

  let risk = RISK_TYPE.CRITICAL;

  if (riskValue < 40) risk = RISK_TYPE.LOW;
  if (riskValue >= 40 && riskValue < 70) risk = RISK_TYPE.MIDDLE;
  return { risk, contract: maxRiskContract };
};

export const getAnalyticsData = (
  data: AnalyzeTransactionResponse, projectAddress: string,
): { risk: RISK_TYPE; contract: ContractAnalysisDTO } => {
  const { risk, contract } = getMaxRiskContract(data, projectAddress);
  return { risk, contract };
};

export const getApproves = (data: AnalyzeTransactionResponse): ApprovesDetails[] => {
  const {
    traceOperations, contractsAnalysis, tokens, contracts,
  } = data;

  const details = traceOperations.approves.reduce((acc, operation) => {
    const hasRisk = !contracts.find((contract) => operation.to === contract.address);
    const address = operation.to;

    const nftsData = tokens.filter((token) => token.contractAddress === operation.contractAddress);

    if (nftsData.length) {
      const collectionName = data.collections.find((collection) => collection.contractAddress === operation.contractAddress)?.name;
      const nfts = nftsData.map((nftData) => {
        const imageSrc = tokenService.getPreviewURL(
          {
            previewURL: nftData.url,
            croppedPreviewURL: nftData.croppedPreviewURL,
            animatedPreviewURL: nftData.animationUrl,
            size: ImageSize.Size560,
            defaultPreviewURL: nftData.url,
          },
          true,
        );
        return {
          isNft: true,
          id: nftData.externalId,
          hasRisk,
          address,
          approvedAsset: getNftName(nftData.externalId, nftData.name),
          imageSrc,
          collectionName,
        };
      });

      return [...acc, ...nfts];
    }

    if (operation.value === null) {
      return [...acc, {
        hasRisk,
        address,
        approvedAsset: 'All of your NFTs and Tokens',
        name: '',
      }];
    }

    const tokenData = contractsAnalysis.find((contract) => contract.address === operation.contractAddress);

    if (tokenData) {
      const contractData = contracts.find((contract) => operation.contractAddress === contract.address);
      const isAllAssets = String(operation.value).length >= MIN_ERC_20_LENGTH_FOR_APPROVE_ALL;
      const tokenSymbol = tokenData.contract.symbol || NA_TOKEN_LABEL;
      const imageSrc = tokenData.contract.imgURL;

      return [...acc, {
        hasRisk,
        address,
        name: contractData?.name || NA_TOKEN_LABEL,
        approvedAsset: isAllAssets
          ? `All of your ${tokenSymbol}`
          : `${fromWei(operation.value || 0, isNull(contractData?.decimals) ? 18 : Number(contractData?.decimals))} ${tokenSymbol}`,
        imageSrc,
      }];

    }

    return acc;
  }, [] as ApprovesDetails[]);

  return details;
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

    const isToken = data.tokens.some((token) => token.contractAddress === projectAddress);
    const isCollection = data.collections.some((collection) => collection.contractAddress === projectAddress);

    if (isToken || isCollection) {
      return [];
    }

    const name = contractData.contract.type === Web3ContractEntity.type.ERC20 ? contractData.contract.name : projectData?.name;

    const { risks, count } = getContractRisks(contractData);

    const riskItem: ProtocolRisks = {
      risk: contractData.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
      isVerified,
      name: name || window.location.hostname,
      description: isVerified ? VERIFIED_CONTRACT_DESCRIPTION : contractData.verified ? '' : NOT_VERIFIED_CONTRACT_DESCRIPTION,
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
      description: contractData.verified ? '' : NOT_VERIFIED_CONTRACT_DESCRIPTION,
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
        description: contractAnalyze.verified ? '' : NOT_VERIFIED_CONTRACT_DESCRIPTION,
      };

      return [...acc, alert];
    }, []);

  return [...getProjectsRisks(), ...collectionRisks, ...erc20Risks];
};

export const getAlerts = (data: AnalyzeTransactionResponse,
  projectAddress: string): {alerts: IHighlightAlert[]; hasSimulationAlert: boolean} => {
  const getProjectsAlert = () => {
    const contractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
      (contractAnalyze) => contractAnalyze.address === projectAddress,
    );

    if (!contractData) {
      return [];
    }
    const isToken = data.tokens.some((token) => token.contractAddress === projectAddress);
    const isCollection = data.collections.some((collection) => collection.contractAddress === projectAddress);

    if (isToken || isCollection) {
      return [];
    }

    const projectData = data.projects.find(
      (project) => (project.id === contractData.contract.projectId),
    );

    const name = contractData.contract.type === Web3ContractEntity.type.ERC20 ? contractData.contract.name : projectData?.name;

    const alert: IHighlightAlert = {
      risk: contractData.verified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
      contract: {
        verified: contractData.verified,
        name: name || window.location.hostname,
      },
    };

    return [alert];
  };

  const collectionsAlerts = data.collections.reduce((acc: IHighlightAlert[], collection) => {
    const isIncluded = data.traceOperations.to.some((traceOperation) => traceOperation.contractAddress === collection.contractAddress);

    if (!isIncluded) { return acc; }

    const contractData: ContractAnalysisDTO | undefined = data.contractsAnalysis.find(
      (contractAnalyze) => contractAnalyze.contract?.address === collection.contractAddress,
    );

    if (!contractData) {
      return acc;
    }

    const alert: IHighlightAlert = {
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
    .reduce((acc: IHighlightAlert[], contractAnalyze) => {
      const isIncluded = data.traceOperations.to.some(
        (traceOperation) => traceOperation.contractAddress === contractAnalyze.address,
      );

      if (!isIncluded) { return acc; }

      const alert: IHighlightAlert = {
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

  const websiteAlert: IHighlightAlert = getWebsiteAlertByStatus(data.siteAnalysis.status);

  const hasSimulationAlert = data.contractsAnalysis.some(
    (contractAnalyze) => contractAnalyze.risk >= 40,
  );
  const simulationAlert = hasSimulationAlert ? [{ risk: RISK_TYPE.CRITICAL, simulation: getTraceWithRisks(data) }] : [];

  const alerts = [
    ...getProjectsAlert(), ...collectionsAlerts, ...erc20Alerts, ...approvedAlerts, websiteAlert, ...simulationAlert,
  ];

  return { alerts, hasSimulationAlert };
};

export const getRisksSum = (data: RisksData): number => data.technicalRisks.count
  // + data.suspiciousActivity.count
  + data.hardcodedLogic.count
  + data.vulnerableCodeDetectors.count;

const getOperationsData = (data: AnalyzeTransactionResponse, operations: TransferMethodDescriptor[]): Array<SwapPart | null> => {
  const {
    tokens, collections, projects, contractsAnalysis, contracts, washTradingStatistics,
  } = data;

  let operationsData = operations.map((operation) => {
    const nftData = tokens.find(
      (token) => token.contractAddress === operation.contractAddress
      && (token.externalId === operation.tokenId || token.externalId === operation.value),
    );

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

      const collectionData = collections.find((collection) => operation.contractAddress === collection.contractAddress);
      const projectData = projects.find((project) => operation.projectId === project.id);
      const washTradingData = washTradingStatistics.find((statistic) => String(statistic.tokenId) === String(nftData.id));

      const nft: SwapPart = {
        isToken: false,
        item: {
          address: nftData.contractAddress,
          id: nftData.externalId,
          name: nftData.name,
          image,
          count: operation.amount || 1,
          collectionName: collectionData?.name || NA_COLLECTION_LABEL,
          marketplaceIcon: projectData?.previewURL || getImageUrl(questionIcon),
          washTrading: washTradingData?.numOfWashTradings ? {
            totalTrades: washTradingData.numOfSales,
            washTrades: washTradingData.numOfWashTradings,
            washTradesPercent: getPercentFromValues(washTradingData.numOfWashTradings, washTradingData.numOfSales),
          } : undefined,
        },
      };

      return nft;
    }

    const tokenData = contractsAnalysis.find((contract) => contract.address === operation.contractAddress);
    if (tokenData) {
      const contractData = contracts.find((contract) => contract.address === operation.contractAddress);
      const amount = fromWeiWithoutFormat(operation.value, isNull(contractData?.decimals) ? 18 : Number(contractData?.decimals));
      const priceUSD = contractData?.lastPriceUSD ? getPriceByAmount(String(amount) || '0', contractData?.lastPriceUSD) : null;
      return {
        isToken: true,
        item: {
          name: tokenData.contract.name || NA_TOKEN_LABEL,
          symbol: tokenData.contract.symbol || NA_TOKEN_LABEL,
          image: tokenData.contract.imgURL,
          amount,
          priceUSD,
        },
      };
    }

    return null;
  });

  const nftsData = operationsData.filter((operation) => operation && !operation.isToken);
  const isOneMarketplace = new Set(nftsData.map((operation) => (operation?.item as SwapNft).marketplaceIcon)).size === 1;

  if (isOneMarketplace) {
    operationsData = operationsData.map((operation) => {
      if (operation && !operation.isToken) {
        return ({
          ...operation,
          item: {
            ...operation.item,
            marketplaceIcon: undefined,
          },
        }) as { isToken: false, item: SwapNft };
      }

      return operation;
    });
  }

  return operationsData as Array<SwapPart | null>;
};

const getETHData = (amount: string, ethPriceUSD: string | null): SwapPart | null => {
  const ethToken: SwapToken | null = Number(amount)
    ? {
      amount: fromWei(amount),
      symbol: PAYMENT_TOKENS.ETH,
      name: 'Ethereum',
      image: getImageUrl(ethIcon),
      priceUSD: ethPriceUSD ? getPriceByAmount(fromWeiWithoutFormat(amount) as string, ethPriceUSD) : null,
    } : null;
  const ethData: SwapPart | null = ethToken ? { isToken: true, item: ethToken } : null;

  return ethData;
};

export const getSwapDetails = (data: AnalyzeTransactionResponse): SwapDetails => {
  const {
    traceOperations,
  } = data;

  const ethFrom = getETHData(traceOperations.eth, traceOperations.ethToUSDCoeff);
  const ethTo = getETHData(traceOperations.receivedETH, traceOperations.ethToUSDCoeff);

  const income = getOperationsData(data, traceOperations.to).filter((item) => item) as SwapPart[];
  const loss = getOperationsData(data, traceOperations.from).filter((item) => item) as SwapPart[];

  return ({ loss: [...(ethFrom ? [ethFrom] : []), ...loss], income: [...(ethTo ? [ethTo] : []), ...income] });
};

const getDangerMessages = (data: AnalyzeTransactionResponse): MessageData[] => {
  const messages = [];
  const contractDataMap = new Map<string, ContractAnalysisDTO>();

  for (const contractData of data.contractsAnalysis) {
    contractDataMap.set(contractData.address, contractData);
  }

  // NOTE: checking only contracts where user gets tokens due to these contracts can restrict some functionality
  for (const { contractAddress } of data.traceOperations.to) {
    const contractData = contractDataMap.get(contractAddress);
    if (!contractData
      || (contractData?.contract.type !== Web3ContractEntity.type.ERC20
      && contractData?.contract.type !== Web3ContractEntity.type.ERC721)) {
      continue;
    }

    // honeypot scam check
    const transferFewTokensData = contractData.code.service6?.transferFewTokens;
    if (transferFewTokensData?.success && !transferFewTokensData?.payload?.actionIsNotSupported) {

      if (transferFewTokensData?.payload?.methodNotExist
        || !transferFewTokensData?.payload?.actionAllowed) {
        messages.push(DANGER_MESSAGES_DATA[
          contractData?.contract.type === Web3ContractEntity.type.ERC20
            ? DANGER_MESSAGES.HONEYPOT_SCAM_ERC_20 : DANGER_MESSAGES.HONEYPOT_SCAM_ERC_721]);
      }
    }

    // transfer restriction check
    const approveTokensData = contractData.code.service6?.approveTokens;
    if (approveTokensData?.success && !approveTokensData?.payload?.actionIsNotSupported) {

      const hasRestriction = approveTokensData?.payload?.approveNotAllowed === false && approveTokensData?.payload?.actionAllowed === true;
      if (approveTokensData?.payload?.methodNotExist || hasRestriction) {
        messages.push(DANGER_MESSAGES_DATA[DANGER_MESSAGES.TRANSFER_RESTRICTION]);
      }
    }

    // owner permission check
    const ownerPermissionData = contractData.code.service7?.transfer;
    if (ownerPermissionData?.success && !ownerPermissionData?.payload?.actionIsNotSupported) {
      if (ownerPermissionData?.payload?.actionAllowed) {
        messages.push(DANGER_MESSAGES_DATA[DANGER_MESSAGES.OWNER_PERMISSIONS]);
      }
    }

    // burn tokens check
    const burnTokensData = contractData.code.service7?.burn;
    if (burnTokensData?.success && !burnTokensData?.payload?.actionIsNotSupported) {
      if (burnTokensData?.payload?.actionAllowed) {
        messages.push(DANGER_MESSAGES_DATA[DANGER_MESSAGES.BURN_TOKENS]);
      }
    }

    if (contractData?.contract.type !== Web3ContractEntity.type.ERC20) continue;

    if (contractData.code.service1?.detectors?.some(({ check }) => check === 'balance_change')) {
      messages.push(DANGER_MESSAGES_DATA[DANGER_MESSAGES.BALANCE_CHANGE_BY_CONTRACT]);
    }

    const service5Data = contractData.code?.service5;
    const transferManyTokensData = contractData.code.service6?.transferManyTokens;
    const service5BalanceDetected = service5Data?.success
      && service5Data.payload.transferNotExist !== true
      && service5Data.payload.balanceFieldNotFound !== true;
    const transferManyTokensDetected = transferManyTokensData?.success
      && (transferManyTokensData?.payload?.methodNotExist || !transferManyTokensData?.payload?.actionAllowed);

    if (service5BalanceDetected && transferManyTokensDetected) {
      messages.push(DANGER_MESSAGES_DATA[DANGER_MESSAGES.BALANCE_LOCKED]);
    }
  }

  return messages;
};

const getWarningMessages = (data: AnalyzeTransactionResponse): MessageData[] => {
  const messages = [];
  const contractDataMap = new Map<string, ContractAnalysisDTO>();

  for (const contractData of data.contractsAnalysis) {
    contractDataMap.set(contractData.address, contractData);
  }

  // NOTE: checking only contracts where user gets tokens due to these contracts can restrict some functionality
  for (const { contractAddress } of data.traceOperations.to) {
    const contractData = contractDataMap.get(contractAddress);
    if (!contractData || contractData?.contract.type !== Web3ContractEntity.type.ERC20) {
      continue;
    }

    if (contractData.code.service6?.severalTransfers?.success
      && (contractData.code.service6?.severalTransfers?.payload?.methodNotExist
      || !contractData.code.service6?.severalTransfers?.payload?.actionAllowed)) {
      messages.push(WARNING_MESSAGES_DATA[WARNING_MESSAGES.TRADING_COOLDOWN]);
    }

  }

  return messages;
};

export const getTransactionsDetails = (data: AnalyzeTransactionResponse): TransactionDetailsData => ({
  swap: getSwapDetails(data),
  permissionRequest: getApproves(data),
  dangerMessages: getDangerMessages(data),
  warningMessages: getWarningMessages(data),
});
