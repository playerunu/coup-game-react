import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useWebpImage } from 'utils/image';
import { Player } from 'types/Player';
import { influenceToImgSrc } from 'types/Influence';

export type TablePlayerProps = {
  player: Player;
};

export const TablePlayer: React.FC<TablePlayerProps> = ({ player }) => {
  const [card1ImgSrc, setCard1ImgSrc] = useState<string>('');
  const [card2ImgSrc, setCard2ImgSrc] = useState<string>('');

  const [coin] = useWebpImage('coin.png');
  const [card1Img, card2Img] = useWebpImage(...[card1ImgSrc, card2ImgSrc]);

  useEffect(() => {
    if (player.card1?.influence !== undefined) {
      setCard1ImgSrc(influenceToImgSrc(player.card1.influence));
    } else {
      setCard1ImgSrc('back.png');
    }

    if (player.card2?.influence !== undefined) {
      setCard2ImgSrc(influenceToImgSrc(player.card2.influence));
    } else {
      setCard2ImgSrc('back.png');
    }
  }, [player]);

  const renderTwoCoinsGroup = (renderSecondCoin: boolean, index?: number) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          maxWidth: '33px',
        }}
        key={index}
      >
        <img src={coin} alt={'coin'} />
        {renderSecondCoin && <img src={coin} alt={'coin'} />}
      </Box>
    );
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <img src={card1Img} key={'card1Img'} alt={card1Img} />
        <img src={card2Img} key={'card2Img'} alt={card2Img} />
      </Box>
      {player.name}
      {!!player.coins && (
        <Box display="flex" flexDirection="row">
          {/* Render groups of two coins */}
          {[...Array(Math.floor(player.coins / 2))].map((index) =>
            renderTwoCoinsGroup(true, index)
          )}

          {/* Render the last coin if the coins number is odd */}
          {player.coins % 2 !== 0 && renderTwoCoinsGroup(false)}
        </Box>
      )}
    </Box>
  );
};
