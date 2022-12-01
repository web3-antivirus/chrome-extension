import { FC } from 'react';
import cn from 'classnames';

import { ImageSize } from 'services/token/shared/enums';
import { tokenService } from 'services/token/token.service';
import { fixImageLink } from 'helpers/image.helpers';

import styles from './styles.module.scss';

interface Props {
  imgClassName?: string;
  className?: string;
  url: string;
  animationUrl: string;
  name: string;
  externalId: string;
  croppedPreviewURL: string;
}

const Image: FC<Props> = ({
  url, animationUrl, name, externalId, croppedPreviewURL, imgClassName, className,
}) => {
  const previewURL = tokenService.getPreviewURL(
    {
      previewURL: url,
      croppedPreviewURL,
      animatedPreviewURL: animationUrl,
      size: ImageSize.Size560,
    },
    true,
  );

  return (
    <div className={cn(styles.wrap, className)}>
      {!!(externalId && (url || croppedPreviewURL)) && <span className={styles.externalId}>{`#${externalId}`}</span>}
      {animationUrl ? (
        <video loop autoPlay muted src={fixImageLink(previewURL)} controls controlsList="nodownload" poster={fixImageLink(url)} />
      ) : (
        <img src={previewURL} alt={name || `#${externalId}`} className={cn(styles.img, imgClassName)} />
      )}
    </div>
  );
};

Image.defaultProps = {
  imgClassName: '',
  className: '',
};

export default Image;
