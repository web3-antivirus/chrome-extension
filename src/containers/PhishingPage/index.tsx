import { FC, memo, useMemo } from 'react';
import cn from 'classnames';

import { getImageUrl } from 'helpers/image.helpers';
import buttonLogo from 'assets/images/icons/attention-red-icon.svg';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import { useWhitelistWeb3Guard } from 'hooks/use-whitelist-web3-guard';
import { getSiteName, getDomainNameWithoutProtocol } from 'helpers/url.helpers';
import { stylesForHideWalletConnect } from 'constants/style.constants';
import { getQueryStringParams } from 'helpers/common.helpers';

import styles from './styles.module.scss';

const Web3Guard: FC = () => {
  const { whiteList, setWhiteListValue } = useWhitelistWeb3Guard();

  const queryParams = getQueryStringParams(window.location.href);
  const { originalUrl, safeUrl } = queryParams;

  const siteName = getSiteName(originalUrl);
  const isSelected = useMemo(() => whiteList?.some((item) => Boolean(item) && getSiteName(item) === siteName), [whiteList]);

  const handleProceedOriginalUrl = () => {
    setWhiteListValue(whiteList ? [...whiteList, siteName] : [siteName]);
    setTimeout(() => {
      window.location.href = originalUrl;
    }, 100);
  };

  const handleChangeCheckbox = (value: boolean) => {
    if (value) {
      setWhiteListValue(whiteList ? [...whiteList, siteName] : [siteName]);
    } else {
      setWhiteListValue(whiteList ? [...whiteList].filter((site) => site !== siteName) : []);
    }
  };

  return (
    <>
      <div className={cn(styles.web3GuardWrapper, 'light', 'extension-nft-check')}>
        <div className={styles.content}>
          <img src={getImageUrl(buttonLogo)} className={styles.icon} alt="attention icon" />
          <p className={styles.title}>Web3 Firewall Warning - Phishing Detected</p>
          <p className={styles.description}>
            {safeUrl ? `${getSiteName(originalUrl)} was flagged because it is suspiciously similar to ${getSiteName(safeUrl)}`
              : `${getSiteName(originalUrl)} was flagged as a phishing site because it may be associated with suspicious activities.`}
          </p>
          <div className={styles.buttonWrapper}>
            {safeUrl && (
              <Button href={safeUrl} target="_self" styleType="green" buttonClassName={styles.button}>
                Go to {getDomainNameWithoutProtocol(safeUrl)} (safe)
              </Button>
            )}
            <Button styleType="gray" buttonClassName={styles.button} onClick={handleProceedOriginalUrl}>
              Proceed anyway (dangerous)
            </Button>
          </div>
          <Checkbox value={isSelected} setValue={() => handleChangeCheckbox(!isSelected)} classNameLabel={styles.label}>
            Permanently unblock this website
          </Checkbox>
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
