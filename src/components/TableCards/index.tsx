import React from 'react';
import { useWebpImage } from 'utils/image';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import { useAppSelector } from 'redux/hooks';
import { selectIsHeroPlayerTurn } from 'redux/game/slice';

const CardBack = styled.img<{ cardIndex: number }>`
  grid-row: 1;
  grid-column: ${(props) => props.cardIndex + 1};
  border-radius: 4px;
  height: 100%;
  display: block;
`;

export type TableCardProps = {
  totalCards: number;
};

export const TableCards: React.FC<TableCardProps> = ({ totalCards }) => {
  const isHeroPlayerTurn = useAppSelector(selectIsHeroPlayerTurn);

  const [cardBackImg] = useWebpImage('back.png');

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 3px) 1fr',
          ...(isHeroPlayerTurn && {
            '&:hover': {
              filter: 'sepia(50)',
              cursor: 'pointer',
            },
          }),
        }}
      >
        {[...Array(totalCards)].map((x, index) => (
          <CardBack key={index} src={cardBackImg} cardIndex={index} />
        ))}
      </Box>
      <Typography variant="body1">{totalCards} cards</Typography>
    </>
  );
};
