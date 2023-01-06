import { FC, memo } from 'react';
import { ScreenProvider } from 'components/ScreenProvider';
import Popup from 'containers/popup';
import ToggleProvider from 'context/toggle.context';

const PageIndex: FC = () => (
  <ScreenProvider>
    <ToggleProvider>
      <Popup />
    </ToggleProvider>
  </ScreenProvider>
);

export default memo(PageIndex);
