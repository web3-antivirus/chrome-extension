import { FC, memo } from 'react';

import InjectPage from 'containers/InjectPage';
import { ScreenProvider } from 'components/ScreenProvider';

const PageInject: FC = () => (
  <ScreenProvider>
    <InjectPage />
  </ScreenProvider>
);

export default memo(PageInject);
