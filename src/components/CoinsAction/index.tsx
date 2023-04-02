import React  from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { useWebpImage } from 'utils/image';

export type TakeCoinsProps = {
  coinsNumber: number;
};

export const CoinActionImg = styled.img<{
  row: number;
  column: number;
  showShadow: boolean;
}>`
  grid-row: ${(props) => props.row + 1};
  grid-column: ${(props) => props.column + 1};
  z-index: ${(props) => 100 - props.row};
  filter: ${(props) =>
    props.showShadow === true
      ? 'drop-shadow(1px 9px 4px rgb(180, 110, 20))'
      : ''};

  border-radius: 4px;
  display: block;
`;

export const CoinsAction: React.FC<TakeCoinsProps> = ({ coinsNumber }) => {
  const [coinImgSrc] = useWebpImage('coin.png');

  const getTakeCoinsTemplateRows = (index: number): string => {
    let firstRowsTemplate = '';
    for (let i = 0; i < index; i++) {
      firstRowsTemplate += '4px ';
    }
    return `${firstRowsTemplate}1fr`;
  };

  return (
    <Box
      display="grid"
      gridTemplateRows={getTakeCoinsTemplateRows(coinsNumber)}
    >
      {[...Array(coinsNumber)].map((_, actionIndex) => (
        <CoinActionImg
          src={coinImgSrc}
          row={actionIndex}
          column={0}
          showShadow={actionIndex === coinsNumber - 1}
        />
      ))}
    </Box>
  );
};
