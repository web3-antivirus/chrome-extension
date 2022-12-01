import { FC, memo } from 'react';
import { ScreenProvider } from 'components/ScreenProvider';
import Popup from 'containers/popup';

const PageIndex: FC = () => (
  <ScreenProvider>
    <Popup />
  </ScreenProvider>
);

export default memo(PageIndex);
