import React, { useRef } from 'react';
import { Box, Stack } from '@mui/material';
import { useWebpImage } from 'utils/image';
import styled from 'styled-components';
import { Draggable, DraggableType } from 'types/DraggableType';
import { useDraggableNode } from 'hooks/useDraggableNode';

const CoinsContainer = styled(Stack)<{ $isclicked: boolean }>`
  justify-content: end;
  user-select: none;
  width: 160px;
  cursor: ${(props) => (props.$isclicked ? 'grabbing' : '')};
  :hover {
    cursor: ${(props) => (!props.$isclicked ? 'pointer' : '')};
  }
`;

export const TableCoin = styled.img<{
  row: number;
  column: number;
  showShadow: boolean;
}>`
  grid-row: ${(props) => props.row + 1};
  grid-column: ${(props) => props.column + 2};
  filter: ${(props) =>
    props.showShadow === true
      ? 'drop-shadow(1px 9px 4px rgb(180, 110, 20))'
      : ''};
  transform: ${(props) => {
    if (props.column < 2) {
      return 'translateY(-35px) translateX(10px)';
      //return 'translateY(-35px)';
    } else {
      return 'translateX(-70px)';
    }
  }};

  border-radius: 4px;
  display: block;
`;

export type TableCoinsProps = {
  totalCoins: number;
};

const COINS_PER_COLUMN = 10;

export const TableCoins: React.FC<TableCoinsProps> = ({ totalCoins }) => {
  const [coinImgSrc] = useWebpImage('coin.png');

  const tableCoinsRef = useRef<HTMLDivElement | null>(null);
  const { isCursorOver, isClicked, isDragging, connectedDragSource } =
    useDraggableNode(tableCoinsRef.current, Draggable.COIN as DraggableType);

  return (
    <>
      <CoinsContainer ref={tableCoinsRef} $isclicked={isClicked}>
        <div ref={tableCoinsRef}>
          <Box
            ref={connectedDragSource}
            display="grid"
            columnGap="3px"
            // 10 stacked coins per row
            gridTemplateRows="repeat(9, 4px) 1fr"
            // 5 separate rows
            gridTemplateColumns="repeat(7, 1fr)"
            sx={{
              marginBottom: '5px',
              marginRight: '-80px',
            }}
          >
            <Box sx={{ gridColumn: '1' }} />
            {[...Array(Math.floor(totalCoins / COINS_PER_COLUMN))].map(
              (x, column) => (
                <>
                  {[...Array(COINS_PER_COLUMN)].map((value, row) => (
                    <TableCoin
                      row={COINS_PER_COLUMN - row - 1}
                      column={column}
                      src={coinImgSrc}
                      draggable={false}
                      showShadow={row === 0}
                    />
                  ))}
                </>
              )
            )}
            {/* Render the last column, if any coins are left */}
            {[...Array(totalCoins % COINS_PER_COLUMN)].map((value, row) => {
              return (
                <TableCoin
                  row={COINS_PER_COLUMN - row - 1}
                  column={Math.floor(totalCoins / COINS_PER_COLUMN)}
                  src={coinImgSrc}
                  draggable={false}
                  showShadow={row === 0}
                />
              );
            })}
            <Box
              sx={{
                gridColumn: `${Math.ceil(totalCoins / COINS_PER_COLUMN + 1)}`,
              }}
            />
          </Box>
        </div>

        {/* <Stack
          flexDirection="row"
          justifyContent="space-evenly"
          sx={{
            ...(!isCursorOver && !isDragging && { visibility: 'hidden' }),
          }}
        >
          <CoinsAction coinsNumber={1} />
          <CoinsAction coinsNumber={2} />
          <CoinsAction coinsNumber={3} />
        </Stack> */}
      </CoinsContainer>
    </>
  );
};
