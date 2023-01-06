import {
  FC, useCallback, useMemo, useState,
} from 'react';
import cn from 'classnames';

import HeaderRisk from 'layouts/HeaderRisk';
import { getCodeExecutionEnvironment } from 'helpers/environments.helpers';
import { AnalyzeTransactionResponse, Web3ContractEntity } from 'interfaces/analyze.interfaces';
import { useExtensionScroll } from 'hooks/common.hooks';

import { Nft } from 'components/assetHeader/CollectionHeader/interfaces';
import { tokenService } from 'services/token/token.service';
import { ImageSize } from 'services/token/shared/enums';
import { COLLECTION_ALERT_STUB_LABEL, NO_COLLECTION_LABEL, RESULT_SCREENS } from './constants';
import ScanningResult from './ScanningResult';
import TransactionInfo from './TransactionInfo';
import styles from './styles.module.scss';
import {
  getAlerts, getMaxRiskContract, getRisks, getTraceWithRisks, getTransactionsDetails,
} from './helpers';
import TokenInfo from './TokenInfo';
import { TokenData } from './interfaces';
import CollectionInfo from './CollectionInfo';

interface Props {
  handleDecline: () => void;
  handleProceed: () => void;
  data: AnalyzeTransactionResponse;
  projectAddress: string;
}

const Result: FC<Props> = ({
  data, handleDecline, handleProceed, projectAddress,
}) => {
  const [screen, setScreen] = useState(RESULT_SCREENS.SCANNING_RESULT);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const { isPopUp } = getCodeExecutionEnvironment();

  useExtensionScroll(styles.wrapper);

  const {
    risk, contract, alerts, risks, transactionDetails, trace, hasSimulationAlert,
  } = useMemo(() => ({
    ...getMaxRiskContract(data),
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
      setTokenData(tokenInfo);
      setScreen(RESULT_SCREENS.ERC20);
    }, [setTokenData, setScreen],
  );

  const handleNFTSelect = useCallback(
    (tokenInfo: TokenData) => {
      const collectionName = tokenInfo.info.name === COLLECTION_ALERT_STUB_LABEL ? NO_COLLECTION_LABEL : tokenInfo.info.name;

      const collectionNfts: Nft[] = data.tokens
        .filter((token) => token.contractAddress === tokenInfo.info.address)
        .map((token) => {
          const preview = tokenService.getPreviewURL(
            {
              previewURL: token.url,
              croppedPreviewURL: token.croppedPreviewURL,
              animatedPreviewURL: token.animationUrl,
              size: ImageSize.Size560,
            },
            true,
          );

          return ({
            name: token.name,
            address: token.contractAddress,
            id: token.externalId,
            preview,
            collection: collectionName,
          });
        });

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
      };

      setTokenData({ ...tokenInfo, info: { ...tokenInfo.info, ...collectionData, collectionNfts } });
      setScreen(RESULT_SCREENS.COLLECTION);
    }, [setTokenData, setScreen, data],
  );

  const handleWebsiteProtocolSelect = useCallback(
    (tokenInfo: TokenData) => {
      const collection = data.collections.find((item) => item.contractAddress === tokenInfo.info.address);
      if (collection) { handleNFTSelect(tokenInfo); } else {
        setTokenData(tokenInfo);
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
            handleDecline={handleDecline}
            handleProceed={handleProceed}
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
  }, [screen, handleGoBack, handleDecline, handleProceed, alerts,
    hasSimulationAlert, risks, trace, tokenData, handleTokenSelect, transactionDetails]);

  return (
    <>
      <HeaderRisk address={contract.address} riskType={risk} isAddressVerified={contract.verified} />
      <div className={cn(styles.wrapper, { [styles.scroll]: isPopUp })}>
        {renderScreen}
      </div>
    </>
  );
};
export default Result;
