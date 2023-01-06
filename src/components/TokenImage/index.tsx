import { FC, useEffect, useState } from 'react';
import stubIcon from 'assets/images/no-token-avatar.svg';
import { getImageUrl } from 'helpers/image.helpers';

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const TokenImage: FC<Props> = ({ alt, src, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSrc = !isLoaded || hasError ? getImageUrl(stubIcon) : src;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <img
      alt={alt}
      loading="lazy"
      src={imageSrc}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
};
export default TokenImage;
