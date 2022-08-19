import React, { useContext, useEffect, useState } from 'react';
import { detectWebP } from './detectWebp';
import { getImage } from './images';

const ImageContext = React.createContext({
  webpSupported: false,
});

type ImageProviderProps = {
  children: React.ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    const detect = async () => {
      const supported = await detectWebP('lossless');
      setIsSupported(supported);
    };

    detect();
  }, []);

  return (
    <ImageContext.Provider
      value={{
        webpSupported: isSupported,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useWebpImage = (...urls: string[]): string[] => {
  const { webpSupported } = useContext(ImageContext);

  const images = urls.map((url) => {
    return getImage(url, webpSupported);
  });

  return images;
};
