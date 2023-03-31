import { FC, memo } from 'react';

import InjectPage from 'containers/InjectPage';
import { ScreenProvider } from 'components/ScreenProvider';
import ToggleProvider from 'context/toggle.context';
import { UserContextProvider } from 'hooks/use-user-id';

const PageInject: FC = () => (
  <ScreenProvider>
    <ToggleProvider>
      <UserContextProvider>
        <InjectPage />
      </UserContextProvider>
    </ToggleProvider>
  </ScreenProvider>
);

export default memo(PageInject);
