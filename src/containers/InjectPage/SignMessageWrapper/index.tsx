import {
  FC, memo, useMemo,
} from 'react';

import { getShadowRoot } from 'helpers/common.helpers';
import { createPortal } from 'react-dom';
import Layout from 'components/Layout';
import FooterButtons from 'components/FooterButtons';
import useUrlAnalyze from 'hooks/use-url-analyze';
import SignMessage from 'modules/analyze/SignMessage';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';
import { SITE_ANALYSIS_INFO } from 'modules/analyze/Scan/constants';
import { ISignMessage } from 'interfaces/common.interfaces';

type Props = {
  handleProceed: () => void;
  handleDecline: () => void;
  message: ISignMessage;
};

const SignMessageWrapper: FC<Props> = ({ message, handleProceed, handleDecline }) => {
  const urlAnalyze = useUrlAnalyze();

  const urlAlert: IHighlightAlert | null = useMemo(() => {
    if (urlAnalyze) {

      const { risk, text } = SITE_ANALYSIS_INFO[urlAnalyze.status];
      return ({
        website: {
          name: window.location.hostname,
          text,
        },
        risk,
      });
    }

    return null;
  }, [urlAnalyze]);

  const renderContent = () => (urlAlert ? (
    <Layout>
      <SignMessage urlAlert={urlAlert} message={message} />
      <FooterButtons
        handleDecline={handleDecline}
        handleProceed={handleProceed}
        text="What would you like to do?"
      />
    </Layout>
  ) : null);

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default memo(SignMessageWrapper);
