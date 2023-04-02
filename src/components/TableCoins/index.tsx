import React, { useRef } from 'react';
import { Box, Stack } from '@mui/material';
import { useWebpImage } from 'utils/image';
import styled from 'styled-components';
import { DraggableType } from 'types/DraggableType';
import { useDraggableNode } from 'hooks/useDraggableNode';
import { SHADOW_COLOR, SMALL_SCREEN_THEME_BREAKPOINT } from 'constants/theme';

const CoinsContainer = styled(Stack)<{ $isclicked: boolean }>`
  justify-content: end;
  user-select: none;
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
  ${({ theme }) => theme.breakpoints.down(SMALL_SCREEN_THEME_BREAKPOINT)} {
    width: 25px;
  }

  grid-row: ${(props) => props.row};
  grid-column: ${(props) => props.column};
  filter: ${(props) =>
    props.showShadow === true
      ? `drop-shadow(1px 9px 4px ${SHADOW_COLOR})`
      : ''};
  transform: ${(props) => {
    if (props.column < 3) {
      return 'translateY(-35px) translateX(80px)';
    }
  }};
  z-index: ${(props) => 100 - props.row};
`;

export type TableCoinsProps = {
  totalCoins: number;
};

const COINS_PER_COLUMN = 10;

export const TableCoins: React.FC<TableCoinsProps> = ({ totalCoins }) => {
  const [coinImgSrc] = useWebpImage('coin.png');

  const tableCoinsRef = useRef<HTMLDivElement | null>(null);
  const { isClicked, connectedDragSource } = useDraggableNode(
    tableCoinsRef.current,
    DraggableType.COIN 
  );

  return (
    <>
      <CoinsContainer $isclicked={isClicked}>
        <div ref={tableCoinsRef}>
          <Box
            ref={connectedDragSource}
            display="grid"
            columnGap="2px"
            // 10 stacked coins per row
            gridTemplateRows="repeat(9, 4px) 1fr"
          >
            {[...Array(Math.floor(totalCoins / COINS_PER_COLUMN))].map(
              (_, column) => (
                <>
                  {[...Array(COINS_PER_COLUMN)].map((_, row) => (
                    <TableCoin
                      row={COINS_PER_COLUMN - row}
                      column={column + 1}
                      src={coinImgSrc}
                      draggable={false}
                      showShadow={row === 0}
                    />
                  ))}
                </>
              )
            )}
            {/* Render the last column, if any coins are left */}
            {[...Array(totalCoins % COINS_PER_COLUMN)].map((_, row) => {
              return (
                <TableCoin
                  row={COINS_PER_COLUMN - row}
                  column={Math.floor(totalCoins / COINS_PER_COLUMN) + 1}
                  src={coinImgSrc}
                  draggable={false}
                  showShadow={row === 0}
                />
              );
            })}
          </Box>
        </div>
      </CoinsContainer>
    </>
  );
};
