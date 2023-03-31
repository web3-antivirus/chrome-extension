import certicBadge from 'assets/images/audits/certik-badge.svg';
import hackenBadge from 'assets/images/audits/hacken-badge.svg';
import cyberscopeBadge from 'assets/images/audits/cyberscope-badge.svg';
import openzeppelinBadge from 'assets/images/audits/openzeppelin-badge.svg';
import coinscopeBadge from 'assets/images/audits/coinscope-badge.svg';
import { getImageUrl } from 'helpers/image.helpers';

export enum AUDITS {
  CERTIK = 'certik',
  HACKEN = 'hacken',
  CYBERSCOPE = 'cyberscope',
  OPEN_ZEPPELIN = 'open_zeppelin',
  COINSCOPE = 'coinscope',
}

export const AUDITS_BADGES_URLS = {
  [AUDITS.CERTIK]: getImageUrl(certicBadge),
  [AUDITS.HACKEN]: getImageUrl(hackenBadge),
  [AUDITS.CYBERSCOPE]: getImageUrl(cyberscopeBadge),
  [AUDITS.OPEN_ZEPPELIN]: getImageUrl(openzeppelinBadge),
  [AUDITS.COINSCOPE]: getImageUrl(coinscopeBadge),
};
