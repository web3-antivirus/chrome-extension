import { FC } from 'react';
import {
  ANALYSIS_RANDOM_STATUSES, ANALYSIS_STATUSES, ANALYSIS_STATUSES_LABELS, STATUS_DURATION_SECONDS,
} from './constants';
import LoaderScreen, { ILoaderScreenProps } from '..';

const TransactionLoader: FC<Pick<ILoaderScreenProps, 'isLoaded' | 'handleCancelClick'>> = ({ isLoaded, handleCancelClick }) => (
  <LoaderScreen
    title="Transaction"
    handleCancelClick={handleCancelClick}
    statuses={ANALYSIS_RANDOM_STATUSES}
    isLoaded={isLoaded}
    statusDurationSeconds={STATUS_DURATION_SECONDS}
    analysisStatuses={ANALYSIS_STATUSES}
    analysisStatusesLabels={ANALYSIS_STATUSES_LABELS}
  />
);

export default TransactionLoader;
