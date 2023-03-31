import alertIcon from 'assets/images/icons/alert-circle.svg';
import warningIcon from 'assets/images/icons/warning-triangle.svg';
import infoIcon from 'assets/images/icons/info-icon.svg';

export enum MESSAGE_TYPES {
  INFO = 'INFO',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
}

export const ICONS_BY_MESSAGE_TYPE = {
  [MESSAGE_TYPES.INFO]: infoIcon,
  [MESSAGE_TYPES.WARNING]: warningIcon,
  [MESSAGE_TYPES.DANGER]: alertIcon,
};
