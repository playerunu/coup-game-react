import React from 'react';
import { Box } from '@mui/material';
import { useWebpImage } from 'utils/image';

export type TableCoinsProps = {
  coins: number;
};

export const TableCoins: React.FC<TableCoinsProps> = ({ coins }) => {
  const [coinImgSrc] = useWebpImage('coin.png');

  return (
    <Box sx={{ position: 'relative' }}>
      {[...Array(coins)].map((x, i) => (
        <Box
          sx={{
            position: 'absolute',
            // TODO dynamically calculate the margins based on the window width/height
            top: `${Math.floor(Math.random() * 150 + 100)}px`,
            left: `${Math.floor(Math.random() * 200 - 80)}px`,
          }}
        >
          <img src={coinImgSrc} alt={'coin'} />
        </Box>
      ))}
    </Box>
  );
};
