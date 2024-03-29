import {
  FC, useCallback, useMemo, useState,
} from 'react';
import cn from 'classnames';

import HeaderRisk from 'layouts/HeaderRisk';
import { getCodeExecutionEnvironment } from 'helpers/environments.helpers';
import { AnalyzeTransactionResponse, Web3ContractEntity } from 'interfaces/analyze.interfaces';
import { useExtensionScroll } from 'hooks/common.hooks';

import FooterButtons from 'components/FooterButtons';
import { fromHexToString, fromWei } from 'helpers/big-number.helpers';
import { TSocials } from 'components/Socials/interfaces';
import { SOCIALS } from 'components/Socials/constants';
import { getAuditsByContract } from 'modules/analyze/Scan/helpers/common.helpers';

import { COLLECTION_ALERT_STUB_LABEL, NO_COLLECTION_LABEL, RESULT_SCREENS } from './constants';
import ScanningResult from './ScanningResult';
import TransactionInfo from './TransactionInfo';
import styles from './styles.module.scss';
import {
  getAlerts, getMaxRiskContract, getRisks, getTraceWithRisks, getTransactionsDetails,
} from './helpers/data.helpers';
import TokenInfo from '../TokenInfo';
import { MintingData, TokenData } from './interfaces';
import CollectionInfo from './CollectionInfo';

interface Props {
  handleDecline: () => void;
  handleProceed: () => void;
  data: AnalyzeTransactionResponse;
  projectAddress: string;
}

const AnalyzeResult: FC<Props> = ({
  data, handleDecline, handleProceed, projectAddress,
}) => {
  const [screen, setScreen] = useState(RESULT_SCREENS.SCANNING_RESULT);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const { isPopUp } = getCodeExecutionEnvironment();

  useExtensionScroll(styles.wrapper);

  const {
    risk, alerts, risks, transactionDetails, trace, hasSimulationAlert,
  } = useMemo(() => ({
    ...getMaxRiskContract(data, projectAddress),
    ...getAlerts(data, projectAddress),
    risks: getRisks(data, projectAddress),
    transactionDetails: getTransactionsDetails(data),
    trace: getTraceWithRisks(data),
  }), [data, projectAddress]);

  const handleGoBack = useCallback(
    () => {
      setScreen(RESULT_SCREENS.SCANNING_RESULT);
    },
    [setScreen],
  );

  const handleERC20Select = useCallback(
    (tokenInfo: TokenData) => {
      const contractData = data.contractsAnalysis.find((item) => item.address === tokenInfo.info.address);

      const minting: MintingData | undefined = (contractData?.code?.service4?.success && contractData?.code?.service4?.payload?.hasMint) ? {
        cap: contractData.code.service4?.payload?.cap ? fromWei(
          fromHexToString(contractData.code.service4.payload.cap), contractData.contract.decimals || 18,
        ) : null,
        total: contractData.code.service4?.payload?.totalSupply ? fromWei(
          fromHexToString(contractData.code.service4.payload.totalSupply),
          contractData.contract.decimals || 18,
        ) : null,
      } : undefined;

      const socialsData = contractData?.contract.socials;
      const socials: TSocials = {
        [SOCIALS.TWITTER]: socialsData?.twitter,
        [SOCIALS.DISCORD]: socialsData?.discord,
        [SOCIALS.WEBSITE]: socialsData?.site,
      };
      const audits = getAuditsByContract(data, tokenInfo.info.address);

      const info = {
        isProxy: contractData?.proxy,
        socials,
        ...minting ? { minting } : {},
        audits,
      };

      setTokenData({ ...tokenInfo, info: { ...tokenInfo.info, ...info } });

      setScreen(RESULT_SCREENS.ERC20);
    }, [setTokenData, setScreen, data],
  );

  const handleNFTSelect = useCallback(
    (tokenInfo: TokenData) => {
      const collectionName = tokenInfo.info.name === COLLECTION_ALERT_STUB_LABEL ? NO_COLLECTION_LABEL : tokenInfo.info.name;

      const collection = data.collections.find((item) => item.contractAddress === tokenInfo.info.address);
      const contractData = data.contractsAnalysis.find((item) => item.address === tokenInfo.info.address);

      const collectionData = {
        sales: collection?.statistic?.sales,
        owners: collection?.statistic?.numOfOwners,
        marketCapUSD: collection?.statistic?.marketCapUSD,
        marketCapETH: collection?.statistic?.marketCapETH ? Number(collection?.statistic?.marketCapETH) : undefined,
        isVerified: collection?.isVerified,
        imageUrl: collection?.logo,
        items: collection?.statistic?.numOfTokens,
        id: collection?.id,
        name: collectionName,
        contractName: contractData?.contract?.name,
        isProxy: contractData?.proxy,
      };

      const socialsData = contractData?.contract.socials;
      const socials: TSocials = {
        [SOCIALS.TWITTER]: socialsData?.twitter,
        [SOCIALS.DISCORD]: socialsData?.discord,
        [SOCIALS.WEBSITE]: socialsData?.site,
      };

      const audits = getAuditsByContract(data, tokenInfo.info.address);

      setTokenData({
        ...tokenInfo,
        info: {
          ...tokenInfo.info, ...collectionData, socials, audits,
        },
      });
      setScreen(RESULT_SCREENS.COLLECTION);
    }, [setTokenData, setScreen, data],
  );

  const handleWebsiteProtocolSelect = useCallback(
    (tokenInfo: TokenData) => {
      const collection = data.collections.find((item) => item.contractAddress === tokenInfo.info.address);
      if (collection) {
        handleNFTSelect(tokenInfo);
      } else {
        const contractData = data.contractsAnalysis.find((item) => item.address === tokenInfo.info.address);

        const socialsData = contractData?.contract.socials;
        const socials: TSocials = {
          [SOCIALS.TWITTER]: socialsData?.twitter,
          [SOCIALS.DISCORD]: socialsData?.discord,
          [SOCIALS.WEBSITE]: socialsData?.site,
        };
        const audits = getAuditsByContract(data, tokenInfo.info.address);

        const info = {
          isProxy: contractData?.proxy,
          socials,
          audits,
        };

        setTokenData({ ...tokenInfo, info: { ...tokenInfo.info, ...info } });
        setScreen(RESULT_SCREENS.WEBSITE_PROTOCOL);
      }
    }, [setTokenData, setScreen],
  );

  const handleTokenSelect = useCallback(
    (tokenInfo: TokenData, type: Web3ContractEntity.type) => {
      switch (type) {
        case Web3ContractEntity.type.ERC1155:
        case Web3ContractEntity.type.ERC721: {
          handleNFTSelect(tokenInfo);
          break;
        }

        case Web3ContractEntity.type.ERC20: {
          handleERC20Select(tokenInfo);
          break;
        }

        default:
          handleWebsiteProtocolSelect(tokenInfo);
          break;
      }

    }, [handleERC20Select, handleNFTSelect, handleWebsiteProtocolSelect],
  );

  const renderScreen = useMemo(() => {
    switch (screen) {
      case RESULT_SCREENS.SCANNING_RESULT:
        return (
          <ScanningResult
            alerts={alerts}
            risks={risks}
            handleTokenSelect={handleTokenSelect}
          />
        );
      case RESULT_SCREENS.WEBSITE_PROTOCOL:
        return (
          <TransactionInfo
            handleGoBack={handleGoBack}
            trace={trace}
            data={tokenData as TokenData}
            transactionDetails={transactionDetails}
            hasSimulationAlert={hasSimulationAlert}
          />
        );
      case RESULT_SCREENS.ERC20:
        return <TokenInfo handleGoBack={handleGoBack} data={tokenData as TokenData} />;
      case RESULT_SCREENS.COLLECTION:
        return <CollectionInfo handleGoBack={handleGoBack} data={tokenData as TokenData} />;
      default:
        return null;
    }
  }, [screen, handleGoBack, alerts,
    hasSimulationAlert, risks, trace, tokenData, handleTokenSelect, transactionDetails]);

  return (
    <>
      <HeaderRisk riskType={risk} />
      <div className={cn(styles.wrapper, { [styles.scroll]: isPopUp })}>
        {renderScreen}
      </div>
      <FooterButtons
        handleDecline={handleDecline}
        handleProceed={handleProceed}
        text="What would you like to do?"
      />
    </>
  );
};
export default AnalyzeResult;
