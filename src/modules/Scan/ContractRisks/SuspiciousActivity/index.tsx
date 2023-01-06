import { getImageUrl } from 'helpers/image.helpers';
import { FC } from 'react';
import extLink from 'assets/images/icons/ext-link.svg';
import arrowLeftIcon from 'assets/images/icons/arrow-green-left.svg';
import { AnalysisDescriptor } from 'types/fetch.type';
import { getEtherscanAddressUrl } from 'helpers/url.helpers';
import { getDateByTimeStamp } from 'helpers/common.helpers';
import { useExtensionScroll } from 'hooks/common.hooks';
import styles from './styles.module.scss';

interface Props {
  data: AnalysisDescriptor;
  handleClose: () => void;
}

const SuspiciousActivity: FC<Props> = ({ data, handleClose }) => {
  const { code, scam } = data;
  const hasSuspiciousActivity = !!scam?.service1?.annotation || !!scam?.service2?.length;
  const hasHardcodedLogic = code?.service3 && 'payload' in code.service3 && !!code.service3.payload?.hardcodedAddresses.length;

  useExtensionScroll(styles.hardcodes);

  const renderSuspiciousActivity = () => (
    <div className={styles.section}>
      <div className={styles.title}>
        Suspicious activity<span className={styles.count}>({scam?.service2?.length || 1})</span>
      </div>
      <div className={styles.activities}>
        {scam?.service2?.length ? (
          scam?.service2.map(({
            subtype, timestamp, tag, address,
          }) => (
            <div className={styles.activity}>
              <span className={styles.date}>{getDateByTimeStamp(Number(timestamp))}</span>
              <span className={styles.message}>
                {tag} (
                <a target="_blank" rel="noreferrer" href={getEtherscanAddressUrl(address)} className={styles.link}>
                  {subtype}
                </a>
                )
                <a target="_blank" rel="noreferrer" href={getEtherscanAddressUrl(address)}>
                  <img src={getImageUrl(extLink)} alt="" />
                </a>
              </span>
            </div>
          ))
        ) : (
          <div className={styles.activity}>
            <span className={styles.message}>{scam?.service1?.annotation}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderHardcodedLogic = () => (
    <div className={styles.section}>
      <div className={styles.title}>
        Hardcoded logic
        <span className={styles.count}>
          ({code?.service3 && 'payload' in code.service3 ? code.service3.payload?.hardcodedAddresses.length : 0})
        </span>
      </div>
      <div className={styles.description}>
        A hardcoded address was found in the contract, which might be a sign of a suspicious behavior
      </div>
      <div className={styles.hardcodes}>
        {code?.service3 && 'payload' in code.service3
          && code.service3.payload?.hardcodedAddresses.map(({
            content,
          }, index) => (
            <div className={styles.hardcode}>
              <div className={styles.index}>#{Number(index) + 1}</div>
              <div className={styles.rows}>
                <div className={styles.row}>
                  <span className={styles.field}>Address:</span>
                  <span className={styles.value}>
                    <a target="_blank" rel="noreferrer" href={getEtherscanAddressUrl(content)} className={styles.link}>
                      {content} <img src={getImageUrl(extLink)} alt="" />
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return hasSuspiciousActivity || hasHardcodedLogic ? (
    <div className={styles.wrap}>
      <button className={styles.button} onClick={handleClose}><img src={getImageUrl(arrowLeftIcon)} alt="" />Back</button>
      {hasHardcodedLogic && renderHardcodedLogic()}
      {hasSuspiciousActivity && renderSuspiciousActivity()}
    </div>
  ) : null;
};

export default SuspiciousActivity;
