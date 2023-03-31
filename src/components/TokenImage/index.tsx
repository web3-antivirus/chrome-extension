import {
  FC, useEffect, useRef, useState,
} from 'react';
import stubIcon from 'assets/images/collection/nft-stub.svg';
import { getImageUrl } from 'helpers/image.helpers';

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { stub?: string }

const TokenImage: FC<Props> = ({
  alt, src, stub = stubIcon, ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  const onLoad = () => setLoaded(true);

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      onLoad();
    }
  });

  const imageSrc = !loaded || hasError ? getImageUrl(stub) : src;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <img
      alt={alt}
      loading="lazy"
      src={imageSrc}
      onError={() => setHasError(true)}
      onLoad={onLoad}
      {...props}
    />
  );
};

TokenImage.defaultProps = {
  stub: stubIcon,
};

export default TokenImage;
