import { ThemeList } from 'types/marketplaces.type';
import {
  OPEN_SEA_URL, RARIBLE_URL, SUPERRARE_URL, FOUNDATION_URL, MAKERSPLACE_URL, NIFTYGATEWAY_URL,
} from './marketplaces-urls.constants';

type TMarketplaceData = {
  [key: string]: {
    selector: string,
    cssProperty: string,
    valueLight: string,
  }
}

export enum THEME {
  LIGHT = 'light-ext',
  DARK = 'light-ext',
}

export const DEFAULT_THEME = THEME.LIGHT;

export const DEFAULT_THEMES: ThemeList = {
  [OPEN_SEA_URL]: DEFAULT_THEME,
  [RARIBLE_URL]: DEFAULT_THEME,
  [SUPERRARE_URL]: DEFAULT_THEME,
  [FOUNDATION_URL]: DEFAULT_THEME,
  [MAKERSPLACE_URL]: DEFAULT_THEME,
  [NIFTYGATEWAY_URL]: DEFAULT_THEME,
  unknown: DEFAULT_THEME,
};

export const MARKETPLACE_THEME_DATA: TMarketplaceData = {
  [OPEN_SEA_URL]: {
    selector: '#__next div',
    cssProperty: 'background-color',
    valueLight: 'rgb(255, 255, 255)',
  },
  [RARIBLE_URL]: {
    selector: 'body',
    cssProperty: 'background-color',
    valueLight: 'rgb(255, 255, 255)',
  },
};
