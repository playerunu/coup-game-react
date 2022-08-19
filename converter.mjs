import imagemin from 'imagemin';
import webp from 'imagemin-webp';

const outputFolder = 'src/assets/images/webp';

const produceWebP = async () => {
  await imagemin(['src/assets/images/*.png'], {
    destination: outputFolder,
    plugins: [
      webp({
        lossless: true,
      }),
    ],
  });
  console.log('PNGs processed');
  await imagemin(['src/assets/images/*.{jpg,jpeg}'], {
    destination: outputFolder,
    plugins: [
      webp({
        quality: 80,
      }),
    ],
  });
  console.log('JPGs and JPEGs processed');
};

produceWebP();
