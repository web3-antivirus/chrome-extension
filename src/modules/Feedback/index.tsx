import {
  FC, memo,
  useEffect, useMemo, useState,
} from 'react';
import cn from 'classnames';
import { detect } from 'detect-browser';

import Button from 'components/Button';
import { getCodeExecutionEnvironment } from 'helpers/environments.helpers';
import { MAX_FEEDBACK_TEXTAREA_SYMBOLS } from 'constants/forms.constants';
import { IPINFO_URL } from 'constants/api.constants';
import { EXTENSION_ACTION_API } from 'constants/check-nft.constants';
import { useUserId } from 'hooks/use-user-id';
import { useCurrentUrl } from 'hooks/use-current-url';

import styles from './styles.module.scss';

type Props = {
  toggleFeedback: () => void
};

const Feedback: FC<Props> = ({ toggleFeedback }) => {
  const [text, setText] = useState('');
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReportSent, setIsReportSent] = useState(false);

  const { isPopUp } = getCodeExecutionEnvironment();
  const userId = useUserId();
  const url = useCurrentUrl();

  useEffect(() => {
    if (hasError && text.length) {
      setHasError(false);
    }
  }, [text, hasError]);

  const handleSubmit = async () => {
    setHasError(!text.length);

    if (text.length) {
      setLoading(true);

      const userInfo = detect();
      const response = await fetch(IPINFO_URL);
      const { ip } = await response.json();

      await fetch(EXTENSION_ACTION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          userId,
          actionEntity: '',
          actionType: 2,
          websiteURL: url,
          actionValue: JSON.stringify({
            type: userInfo?.type,
            browser: `${userInfo?.name || ''} ${userInfo?.version || ''}`,
            os: userInfo?.os,
            ip,
            message: text,
          }),
        }),
      });

      setLoading(true);
      setIsReportSent(true);
      setTimeout(toggleFeedback, 3000);
    }
  };

  const isLongText = useMemo(() => text.length > MAX_FEEDBACK_TEXTAREA_SYMBOLS, [text]);

  return (
    <div className={cn(styles.wrapper, { [styles.scroll]: isPopUp })}>
      {isReportSent ? (
        <div className={styles.sentWrapper}>
          <h3 className={styles.sentTitle}>Thank you!</h3>
          <p className={styles.sentSubTitle}>Your request has been submitted.</p>
        </div>
      ) : (
        <>
          <p className={styles.title}>Report an issue</p>
          <div className={styles.appearance}>
            <p className={styles.themeTitle}>Describe your problem or suggestion</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.textarea}
              placeholder="Give us more details"
            />
            <div className={cn(styles.info, { [styles.withError]: hasError })}>
              {hasError && (
                <p className={styles.error}>
                  Please fill in the field above
                </p>
              )}
              <p className={styles.symbols}>
                <span className={cn({ [styles.overmuchSymbols]: isLongText })}>
                  {text.length}
                </span>/{MAX_FEEDBACK_TEXTAREA_SYMBOLS}
              </p>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              onClick={handleSubmit}
              styleType={isLongText ? 'gray' : 'green'}
              buttonClassName={cn(styles.button, { [styles.disabledBtn]: isLongText })}
              loading={loading}
              disabled={isLongText}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Feedback);
