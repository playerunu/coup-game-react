import React from 'react';
import { Box, Typography } from '@mui/material';
import { useWebpImage } from 'utils/image';
import { useAppSelector } from 'redux/hooks';
import { selectIsHeroPlayerTurn } from 'redux/game/slice';
import styled from 'styled-components';

const TableCoin = styled.img<{ row: number; column: number }>`
  grid-row: ${(props) => props.row + 1};
  grid-column: ${(props) => props.column + 1};
  border-radius: 4px;
  display: block;
`;

export type TableCoinsProps = {
  totalCoins: number;
};

const COINS_PER_COLUMN = 10;

export const TableCoins: React.FC<TableCoinsProps> = ({ totalCoins }) => {
  const [coinImgSrc] = useWebpImage('coin.png');
  const isHeroPlayerTurn = useAppSelector(selectIsHeroPlayerTurn);

  return (
    <>
      <Box
        display="grid"
        columnGap="3px"
        // 10 stacked coins per row
        gridTemplateRows="repeat(9, 4px) 1fr"
        // 5 sepparate rows
        gridTemplateColumns="repeat(5, 1fr)"
        sx={{
          ...(isHeroPlayerTurn && {
            '&:hover': {
              filter: 'sepia(50)',
              cursor: 'pointer',
            },
          }),
        }}
      >
        {[...Array(Math.floor(totalCoins / COINS_PER_COLUMN))].map(
          (x, column) => (
            <>
              {[...Array(COINS_PER_COLUMN)].map((xx, row) => (
                <TableCoin row={row} column={column} src={coinImgSrc} />
              ))}
            </>
          )
        )}
        {/* Render the last column, if any coins are left */}
        {[...Array(totalCoins % COINS_PER_COLUMN)].map((xx, row) => (
          <TableCoin
            row={row}
            column={Math.floor(totalCoins / COINS_PER_COLUMN)}
            src={coinImgSrc}
          />
        ))}
      </Box>
      <Typography variant="body1">{totalCoins} coins</Typography>
    </>
  );
};
