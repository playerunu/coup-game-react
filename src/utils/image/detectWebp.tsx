export type Feature = 'lossy' | 'lossless' | 'alpha' | 'animation';

export const detectWebP = (feature: Feature): Promise<boolean> => {
  return new Promise((resolve) => {
    const kTestImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha:
        'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation:
        'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    };
    const img = new Image();
    img.onload = function () {
      const result = img.width > 0 && img.height > 0;
      resolve(result);
    };
    img.onerror = function () {
      resolve(false);
    };
    img.src = 'data:image/webp;base64,' + kTestImages[feature];
  });
};
