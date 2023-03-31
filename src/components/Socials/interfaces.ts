import { SOCIALS } from './constants';

export type TSocials = {
  [key in SOCIALS]: string | null | undefined // link
}
