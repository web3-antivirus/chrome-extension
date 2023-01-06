import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';

import logo from 'assets/images/no-token-avatar.svg';
import { IMAGE_DOMAIN } from 'constants/url.constants';
import { getImageUrl } from 'helpers/image.helpers';

import type { Interfaces } from './shared';
import { Enums } from './shared';

export class TokenService {

  /**
   * Converts url w/ IPFS protocol to HTTP protocol.
   *
   * @param  {string} url
   * @return {string}
   */
  convertIPFSURLToHTTP(
    url: string, //
  ): string {
    if (startsWith(url, 'ipfs://') === false) {
      return url;
    }

    const httpURL = url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    // for cases where route /ipfs returns from backend
    const filteredURL = httpURL.replace('ipfs/ipfs/', 'ipfs/');
    return filteredURL;
  }

  /**
   * Returns the token's preview URL. If origin URL isn't defined, logic will return default stub image.
   * If `forceUseVideo` is enabled and origin URL is a video, logic will return video. In all other
   * cases logic will return cropped image of required size.
   *
   * @param  {Interfaces.ImageDescriptor} imageDescriptor
   * @param  {Enums.ImageSize} [size=Enums.ImageSize.Size72]
   * @param  {boolean} [forceUseVideo=false]
   * @return {string}
   */
  getPreviewURL(
    imageDescriptor: Interfaces.ImageDescriptor,
    forceUseVideo = false,
  ): string {
    if (forceUseVideo === true && isNil(imageDescriptor.animatedPreviewURL) === false
        && isEmpty(imageDescriptor.animatedPreviewURL) === false) {
      return this.convertIPFSURLToHTTP(String(imageDescriptor.animatedPreviewURL));
    }

    if (isNil(imageDescriptor.previewURL) === true || isEmpty(imageDescriptor.previewURL) === true) {
      return imageDescriptor.defaultPreviewURL ?? getImageUrl(logo);
    }

    const croppedPreviewURL = imageDescriptor?.croppedPreviewURL;
    if (isNil(croppedPreviewURL) === true || isEmpty(croppedPreviewURL) === true) {
      return this.convertIPFSURLToHTTP(imageDescriptor?.previewURL);
    }

    const forbiddenExtensions = ['.svg'];
    const imageHasForbiddenExtension = forbiddenExtensions.some((forbiddenExtension) => endsWith(croppedPreviewURL, forbiddenExtension));
    if (imageHasForbiddenExtension) {
      return `${IMAGE_DOMAIN}/${String(croppedPreviewURL)}`;
    }

    const size = imageDescriptor.size ?? Enums.ImageSize.Size72;
    // eslint-disable-next-line no-useless-escape
    const croppedPreviewURLWithSize = String(croppedPreviewURL).replace(/(\.[^\.]*)$/, `_${size}$1`);
    return `${IMAGE_DOMAIN}/${croppedPreviewURLWithSize}`;
  }

}

export const tokenService = new TokenService();
