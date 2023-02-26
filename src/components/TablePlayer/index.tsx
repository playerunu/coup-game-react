import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useWebpImage } from 'utils/image';
import { Player } from 'types/Player';
import { influenceToImgSrc } from 'types/Influence';
import styled from 'styled-components';

const CardImg = styled.img`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 50px;
  }

  border-radius: 4px;
  border: 1px solid #555;
`;

export const TableCoin = styled.img<{
  row: number;
  column: number;
  showShadow: boolean;
}>`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 25px;
  }
 
  grid-row: ${(props) => props.row};
  grid-column: ${(props) => props.column};
  z-index: ${(props) => 100 - props.row};
  filter: ${(props) =>
    props.showShadow === true
      ? 'drop-shadow(1px 9px 4px rgb(180, 110, 20))'
      : ''};
  }};

  border-radius: 4px;
  display: block;
`;

const COINS_PER_COLUMN = 7;

export type TablePlayerProps = {
  player: Player;
  showCoinsOnLeft?: boolean;
};

export const TablePlayer: React.FC<TablePlayerProps> = ({
  player,
  showCoinsOnLeft = false,
}) => {
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

  const playerCoins = !!player.coins && (
    <Stack justifyContent="end">
      <Box
        display="grid"
        columnGap="1px"
        // 7 stacked coins per row
        gridTemplateRows="repeat(6, 4px) 1fr"
      >
        {[...Array(Math.floor(player.coins / COINS_PER_COLUMN))].map(
          (x, column) => (
            <>
              {[...Array(COINS_PER_COLUMN)].map((_, row) => (
                <TableCoin
                  row={COINS_PER_COLUMN - row}
                  column={column + 1}
                  src={coin}
                  draggable={false}
                  showShadow={row === 0}
                />
              ))}
            </>
          )
        )}
        {/* Render the last column, if any coins are left */}
        {[...Array(player.coins % COINS_PER_COLUMN)].map((value, row) => (
          <TableCoin
            row={COINS_PER_COLUMN - row}
            // This is so stupid, can't get rid of player.coins 'object is possible undefined'
            column={
              !!player.coins
                ? Math.floor(player?.coins / COINS_PER_COLUMN) + 1
                : 0
            }
            src={coin}
            draggable={false}
            showShadow={row === 0}
          />
        ))}
      </Box>
    </Stack>
  );

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        columnGap={'3px'}
        sx={{ padding: '4px' }}
      >
        {showCoinsOnLeft && playerCoins}
        <Box>
          <Box display="grid" gridTemplateColumns="35px 1fr">
            <CardImg src={card1Img} key={'card1Img'} alt={card1Img} />
            <CardImg src={card2Img} key={'card2Img'} alt={card2Img} />
          </Box>
        </Box>
        {!showCoinsOnLeft && playerCoins}
      </Box>
      <>{player.name}</>
    </Box>
  );
};
