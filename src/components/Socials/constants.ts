import { DiscordSocialIcon, TwitterSocialIcon, WebsiteSocialIcon } from 'constants/icons.constants';

export enum SOCIALS {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  WEBSITE = 'WEBSITE',
}

export const SOCIAL_LABELS = {
  [SOCIALS.TWITTER]: 'Twitter',
  [SOCIALS.DISCORD]: 'Discord',
  [SOCIALS.WEBSITE]: 'Website',
};

export const SOCIAL_ICONS = {
  [SOCIALS.TWITTER]: TwitterSocialIcon,
  [SOCIALS.DISCORD]: DiscordSocialIcon,
  [SOCIALS.WEBSITE]: WebsiteSocialIcon,
};
