import { FC, useMemo, memo } from 'react';

import { Tab } from 'interfaces/common.interfaces';
import TokenHeader from 'components/assetHeader/TokenHeader';
import Tabs from 'components/Tabs';
import Risks from 'components/Risks';

import { TOKEN_TYPES, TOKEN_TYPES_LABELS } from 'constants/token.constants';
import Token from './Token';
import { TokenData } from '../interfaces';
import { getRisksSum } from '../helpers';

interface Props {
  handleGoBack: () => void;
  data: TokenData;
}

enum TABS_TEXTS {
  RISKS = 'RISKS',
  TOKEN = 'TOKEN',
}

const TokenInfo: FC<Props> = ({ handleGoBack, data }) => {
  const TABS: Tab[] = useMemo(
    () => {
      const riskSum = getRisksSum(data.risks);

      return ([
        {
          text: TABS_TEXTS.RISKS,
          hasRisk: Boolean(riskSum),
          count: riskSum,
          Component: () => (
            <Risks
              {...data.risks}
            />
          ),
        },
        {
          text: TABS_TEXTS.TOKEN,
          hasRisk: false,
          Component: () => (
            <Token
              tokenType={TOKEN_TYPES_LABELS[TOKEN_TYPES.ERC20]}
              name={data.info.symbol || ''}
              contract={data.info.name}
              dateCreation={data.info.createdAt}
              image={data.info.imageUrl}
            />
          ),
        },
      ]);
    }, [data],
  );

  return (
    <>
      <TokenHeader
        handleGoBack={handleGoBack}
        isAddressVerified={data.info.isAddressVerified}
        address={data.info.address}
        name={data.info.name}
      />
      <Tabs data={TABS} />
    </>
  );
};

export default memo(TokenInfo);
