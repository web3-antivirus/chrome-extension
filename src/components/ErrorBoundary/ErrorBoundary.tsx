import {
  Component,
  FC,
  ReactNode,
} from 'react';
import * as Sentry from '@sentry/browser';
import { escapeRegExp } from 'lodash';
import { useUser } from 'hooks/use-user-id';

interface Props {
  handleError: () => void;
  children: ReactNode;
}

interface ErrorBoundaryProps extends Props {
  userId: string;
}

const isDevelopment = process.env.NODE_ENV === 'development';
const { REACT_APP_SENTRY_URL } = process.env;

// TODO: add source maps
Sentry.init({
  dsn: isDevelopment ? '' : REACT_APP_SENTRY_URL,
  integrations: [
    new Sentry.Integrations.GlobalHandlers({
      onerror: true,
      onunhandledrejection: false,
    }),
  ],
  allowUrls: [
    new RegExp(escapeRegExp(chrome.runtime.getURL('/')), 'i'),
  ],
});

class ErrorBoundaryInner extends Component<ErrorBoundaryProps> {

  componentDidCatch(error: any) {
    const { userId } = this.props;
    Sentry.captureException(error, { user: { id: userId, email: '' }, tags: { scope: 'INJECT' } });
    // eslint-disable-next-line react/destructuring-assignment
    this.props.handleError();
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }

}

export const ErrorBoundary: FC<Props> = ({ children, handleError }) => {
  const { id } = useUser();
  return (
    <ErrorBoundaryInner
      handleError={handleError}
      userId={id}
    >
      {children}
    </ErrorBoundaryInner>
  );
};
