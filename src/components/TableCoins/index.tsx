import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useWebpImage } from 'utils/image';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { DraggableType } from 'constants/DraggableType';
import { CoinsAction } from 'components/CoinsAction';
import { getEmptyImage } from 'react-dnd-html5-backend';

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
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DraggableType.COIN,
      options: {
        dropEffect: 'copy',
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging() || isClicked,
      }),
    }),
    []
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const tableCoinsRef = useRef<HTMLDivElement | null>(null);
  const [isCursorOver, setIsCurosOver] = useState<boolean>(false);
  const handleMouseOver = () => setIsCurosOver(true);
  const handleMouseOut = () => setIsCurosOver(false);

  useEffect(() => {
    const node = tableCoinsRef.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      node.addEventListener('dragstop', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
        node.removeEventListener('dragstop', handleMouseOut);
      };
    }
  }, []);

  return (
    <>
      {/* <DragPreviewImage connect={preview} src={coinImgSrc} /> */}
      {/* <CustomDragLayer visible={isClicked} dragItemType={DraggableType.COIN}/> */}
      <Stack
        justifyContent="end"
        sx={{ userSelect: 'none' }}
        onClick={() => {
          setIsClicked(!isClicked);
        }}
      >
        <div ref={tableCoinsRef}>
          <Box
            ref={drag}
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
          <Typography variant="body2" textAlign="center">
            {totalCoins} coins
          </Typography>
        </div>

        <Stack
          flexDirection="row"
          justifyContent="space-evenly"
          sx={{
            ...(!isCursorOver && !isDragging && { visibility: 'hidden' }),
          }}
        >
          <CoinsAction coinsNumber={1} />
          <CoinsAction coinsNumber={2} />
          <CoinsAction coinsNumber={3} />
        </Stack>
      </Stack>
    </>
  );
};
