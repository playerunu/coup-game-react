import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import {
  cancelPendingHeroPlayerMove,
  setPendingHeroPlayerMove,
} from 'redux/game/slice';
import { useAppDispatch } from 'redux/hooks';
import styled from 'styled-components';
import { ActionType } from 'types/Action';
import { Draggable } from 'types/DraggableType';
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
  const dispatch = useAppDispatch();
  const [coinImgSrc] = useWebpImage('coin.png');

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: Draggable.COIN,
      //drop: () => game.moveKnight(x, y),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );

  useEffect(() => {
    if (isOver) {
      if (coinsNumber === 1) {
        dispatch(setPendingHeroPlayerMove(ActionType.TakeOneCoin));
      } else if (coinsNumber === 2) {
        dispatch(setPendingHeroPlayerMove(ActionType.TakeTwoCoins));
      } else if (coinsNumber === 3) {
        dispatch(setPendingHeroPlayerMove(ActionType.TakeThreeCoins));
      }
    } else {
      dispatch(cancelPendingHeroPlayerMove());
    }
  }, [dispatch, isOver, coinsNumber]);

  const getTakeCoinsTemplateRows = (index: number): string => {
    let firstRowsTemplate = '';
    for (let i = 0; i < index; i++) {
      firstRowsTemplate += '4px ';
    }
    return `${firstRowsTemplate}1fr`;
  };

  return (
    <Box
      ref={drop}
      display="grid"
      gridTemplateRows={getTakeCoinsTemplateRows(coinsNumber)}
      sx={{
        borderRadius: '4px',
        ...(isOver && { backgroundColor: 'gray' }),
      }}
    >
      {[...Array(coinsNumber)].map((value, actionIndex) => (
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
