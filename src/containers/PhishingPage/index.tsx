import { FC, memo, useState } from 'react';
import cn from 'classnames';
import { getImageUrl } from 'helpers/image.helpers';
import buttonLogo from 'assets/images/icons/attention-red-icon.svg';
import Checkbox from 'components/Checkbox';
import { getSiteName, getDomainNameWithoutProtocol } from 'helpers/url.helpers';
import logo from 'assets/images/icons/logo-redesign.svg';

import { stylesForHideWalletConnect } from 'constants/style.constants';
import { getQueryStringParams } from 'helpers/common.helpers';
import { useSessionWhitelist } from 'hooks/use-session-whitelist';
import ButtonNew from 'components/ButtonNew';
import { BUTTON_TYPES } from 'constants/button.constants';
import { LANDING_URL } from 'constants/url.constants';
import styles from './styles.module.scss';

const Web3Guard: FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const queryParams = getQueryStringParams(window.location.href);

  const { originalUrl, safeUrl } = queryParams;
  const [, setSiteToWhiteList] = useSessionWhitelist();
  const siteName = getSiteName(originalUrl);

  const handleProceedOriginalUrl = async () => {
    await setSiteToWhiteList(siteName, isChecked);
    // setWhiteListValue(whiteList ? [...whiteList, siteName] : [siteName]);
    setTimeout(() => {
      window.location.href = originalUrl;
    }, 100);
  };

  return (
    <>
      <div className={cn(styles.web3GuardWrapper, 'light-ext', 'extension-nft-check')}>
        <div className={styles.content}>
          <img src={getImageUrl(buttonLogo)} className={styles.icon} alt="attention icon" />
          <p className={styles.title}>Web3 Firewall Warning - Phishing Detected</p>
          <p className={styles.description}>
            {safeUrl
              ? (
                <>
                  The website <b>{getSiteName(originalUrl)}</b> was flagged as a phishing
                  site because it may be associated with suspicious activities.
                  <p className={styles.subDescription}>We think you might be looking for
                    <a className={styles.accent} href={safeUrl} target="_blank" rel="noreferrer">
                      &nbsp;{getDomainNameWithoutProtocol(safeUrl, true)}
                    </a>
                  </p>
                </>
              )
              : (
                <>The website <b>{getSiteName(originalUrl)}</b> was flagged as a phishing
                  site because it may be associated with suspicious activities.
                </>
              )}
          </p>
          <div className={styles.buttonWrapper}>
            <ButtonNew
              href={originalUrl}
              styleType={BUTTON_TYPES.TERTIARY}
              className={styles.button}
              onClick={handleProceedOriginalUrl}
            >
              Proceed anyway (dangerous)
            </ButtonNew>
            {safeUrl && (
              <ButtonNew
                href={safeUrl}
                target="_self"
                styleType={BUTTON_TYPES.POSITIVE}
                className={styles.button}
              >
                Go to {getDomainNameWithoutProtocol(safeUrl, true)}
              </ButtonNew>
            )}
          </div>
          <Checkbox value={isChecked} setValue={() => setIsChecked(!isChecked)} classNameLabel={styles.label}>
            Permanently unblock this website
          </Checkbox>
          <a href={LANDING_URL} rel="noreferrer" target="__blank">
            <img src={getImageUrl(logo)} className={styles.logo} alt="logo web3 antivirus" />
          </a>
        </div>
      </div>
      <style>{stylesForHideWalletConnect}</style>
    </>
  );
};

Web3Guard.defaultProps = {
  originalUrl: '',
};

export default memo(Web3Guard);
