import ambassador from 'assets/images/ambassador.png';
import ambassadorWebp from 'assets/images/webp/ambassador.webp';
import assassin from 'assets/images/assassin.png';
import assassinWebp from 'assets/images/webp/assassin.webp';
import captain from 'assets/images/captain.png';
import captainWebp from 'assets/images/webp/captain.webp';
import contessa from 'assets/images/contessa.png';
import contessaWebp from 'assets/images/webp/contessa.webp';
import duke from 'assets/images/duke.png';
import dukeWebp from 'assets/images/webp/duke.webp';

import ambassadorIcon from 'assets/images/ambassador-icon.png';
import ambassadorIconWebp from 'assets/images/webp/ambassador-icon.webp';
import assassinIcon from 'assets/images/assassin-icon.png';
import assassinIconWebp from 'assets/images/webp/assassin-icon.webp';
import captainIcon from 'assets/images/ambassador-icon.png';
import captainIconWebp from 'assets/images/webp/ambassador-icon.webp';
import contessaIcon from 'assets/images/ambassador-icon.png';
import contessaIconWebp from 'assets/images/webp/ambassador-icon.webp';
import dukeIcon from 'assets/images/ambassador-icon.png';
import dukeIconWebp from 'assets/images/webp/ambassador-icon.webp';

import back from 'assets/images/back.png';
import backWebp from 'assets/images/webp/back.webp';
import coin from 'assets/images/coin.png';
import coinWebp from 'assets/images/webp/coin.webp';

import background from 'assets/images/background.jpg';
import backgroundWebp from 'assets/images/webp/background.webp';

export const getImage = (name: string, webpSupported: boolean): string => {
  const images: Record<string, string> = {
    'ambassador.png': webpSupported ? ambassadorWebp : ambassador,
    'assassin.png': webpSupported ? assassinWebp : assassin,
    'captain.png': webpSupported ? captainWebp : captain,
    'contessa.png': webpSupported ? contessaWebp : contessa,
    'duke.png': webpSupported ? dukeWebp : duke,

    'ambassadorIcon.png': webpSupported ? ambassadorIconWebp : ambassadorIcon,
    'assassinIcon.png': webpSupported ? assassinIconWebp : assassinIcon,
    'captainIcon.png': webpSupported ? captainIconWebp : captainIcon,
    'contessaIcon.png': webpSupported ? contessaIconWebp : contessaIcon,
    'dukeIcon.png': webpSupported ? dukeIconWebp : dukeIcon,

    'back.png': webpSupported ? backWebp : back,
    'coin.png': webpSupported ? coinWebp : coin,

    'background.jpg': webpSupported ? backgroundWebp : background,
  };

  return images[name];
};
