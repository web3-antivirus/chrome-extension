import { useEffect, useState } from 'react';

type TOptions = {
  width: number | undefined
  height: number | undefined
}

const useWindowSize = (): TOptions => {
  const [windowDimensions, setWindowDimensions] = useState<TOptions>({ width: undefined, height: undefined });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowSize;
