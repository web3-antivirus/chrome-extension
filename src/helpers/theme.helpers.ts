import { THEME } from '../constants/theme.constants';
import { getImageUrl } from './image.helpers';

export const getCheckByTheme = (theme: string): boolean => (theme === THEME.LIGHT);

export const getImageByTheme = (theme: string, imgSrcForLight: string, imgSrcForDark: string): string => {
  if (theme === THEME.LIGHT) {
    return getImageUrl(imgSrcForLight);
  }

  return getImageUrl(imgSrcForDark);
};
