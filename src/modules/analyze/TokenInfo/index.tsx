import { FC, useMemo, memo } from 'react';

import { Tab } from 'interfaces/common.interfaces';
import TokenHeader from 'components/assetHeader/TokenHeader';
import Tabs from 'components/Tabs';
import Risks from 'components/Risks';

import { TOKEN_TYPES, TOKEN_TYPES_LABELS } from 'constants/token.constants';
import Token from './Token';
import { TokenData } from '../Scan/interfaces';
import { getRisksSum } from '../Scan/helpers/data.helpers';
import { NOT_VERIFIED_CONTRACT_HEADER_DESCRIPTION } from '../Scan/constants';

interface Props {
  handleGoBack: () => void;
  data: TokenData;
}

enum TABS_TEXTS {
  RISKS = 'CONTRACT',
  TOKEN = 'TOKEN',
}

const TokenInfo: FC<Props> = ({ handleGoBack, data }) => {
  const { isAddressVerified } = data.info;
  const TABS: Tab[] = useMemo(
    () => {
      const riskSum = getRisksSum(data.risks);

      return ([
        {
          text: TABS_TEXTS.RISKS,
          risksCount: riskSum,
          Component: () => (
            <Risks
              {...data.risks}
              isVerified={isAddressVerified}
            />
          ),
        },
        {
          text: TABS_TEXTS.TOKEN,
          hasRisk: false,
          Component: () => (
            <Token
              tokenType={TOKEN_TYPES_LABELS[TOKEN_TYPES.ERC20]}
              contract={data.info.name}
              dateCreation={data.info.createdAt}
              minting={data.info.minting}
            />
          ),
        },
      ]);
    }, [data, isAddressVerified],
  );

  return (
    <>
      <TokenHeader
        handleGoBack={handleGoBack}
        isAddressVerified={data.info.isAddressVerified}
        address={data.info.address}
        name={data.info.name}
        description={!isAddressVerified ? NOT_VERIFIED_CONTRACT_HEADER_DESCRIPTION : ''}
        hasRisk={!isAddressVerified}
        isProxy={data.info.isProxy}
        socials={data.info.socials}
        tokenImage={data.info.imageUrl}
        audits={data.info.audits}
      />
      <Tabs data={TABS} />
    </>
  );
};

export default memo(TokenInfo);
