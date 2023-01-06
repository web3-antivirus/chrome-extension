import { FC, memo } from 'react';

import InjectPage from 'containers/InjectPage';
import { ScreenProvider } from 'components/ScreenProvider';
import ToggleProvider from 'context/toggle.context';

const PageInject: FC = () => (
  <ScreenProvider>
    <ToggleProvider>
      <InjectPage />
    </ToggleProvider>
  </ScreenProvider>
);

export default memo(PageInject);
