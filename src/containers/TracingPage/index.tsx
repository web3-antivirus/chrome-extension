import {
  FC, memo, useEffect, useState,
} from 'react';
import cn from 'classnames';
import { stylesForHideWalletConnect } from 'constants/style.constants';
import logoLight from 'assets/images/icons/logo-redesign.svg';
import { OPEN_TRACING_DIAGRAM_PAGE } from '../../constants/chrome-send-message.constants';
import { TRACE_DATA_KEY } from '../../constants/session-storage.constants';
import { TraceWithRisk } from '../../types/fetch.type';
import Tracing from './Tracing';

import styles from './styles.module.scss';

type Props = {
};

const TracingPage: FC<Props> = () => {
  const getHrefForLogo = () => process.env.REACT_APP_CHECK_NFT_W3A_PATH;
  const [trace, setTrace] = useState<TraceWithRisk[]>([]);

  useEffect(() => {

    const traceDataFromStorage = sessionStorage.getItem(TRACE_DATA_KEY);

    if (!traceDataFromStorage) {
      const onMessageHandler = (response: {message: string, trace: TraceWithRisk[]}) => {
        // Ensure it is run only once, as we will try to message twice
        if (response.message === OPEN_TRACING_DIAGRAM_PAGE) {
          setTrace(response.trace);
          sessionStorage.setItem(TRACE_DATA_KEY, JSON.stringify(response.trace));
        }
        chrome.runtime.onMessage.removeListener(onMessageHandler);
      };
      chrome.runtime.onMessage.addListener(onMessageHandler);
      return () => chrome.runtime.onMessage.removeListener(onMessageHandler);
    }
    setTrace(JSON.parse(traceDataFromStorage) ?? []);
    return () => null;
  }, []);

  return (
    <>
      <div className={cn('light-ext', 'extension-nft-check')}>
        <div
          className={styles.tracingWrapper}
          role="button"
          tabIndex={0}
        >
          {!!trace.length && (
            <div className={styles.content}>
              <Tracing trace={trace} />
            </div>
          )}
        </div>
        <div>
          <a href={getHrefForLogo()} target="_blank" rel="noreferrer" className={styles.logoWrapper}>
            <img src={logoLight} alt="logo" className={styles.logo} />
          </a>
        </div>
      </div>
      <style>{stylesForHideWalletConnect}</style>
    </>
  );
};

TracingPage.defaultProps = {
  originalUrl: '',
};

export default memo(TracingPage);
