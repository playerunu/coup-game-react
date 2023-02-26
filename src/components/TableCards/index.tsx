import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { Box, Stack, Typography } from '@mui/material';
import styled from 'styled-components';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { useWebpImage } from 'utils/image';
import { DraggableType } from 'constants/DraggableType';
import { CustomDragLayer } from 'components/CustomDragLayer';

const CardsContainer = styled(Stack)<{ $isclicked: boolean }>`
  justify-content: end;
  user-select: none;
  width: 160px;
  cursor: ${(props) => (props.$isclicked ? 'grabbing' : '')};
  :hover {
    cursor: ${(props) => (!props.$isclicked ? 'pointer' : '')}; 
  }
`;

// TODO make this a component
const CardBack = styled.img<{
  cardIndex: number;
  showShadow: boolean;
  isCursorOver: boolean;
  $isClicked: boolean;
  $isDragging: boolean;
}>`
visibility: ${(props) =>
  props.cardIndex <= 1 && (props.$isClicked || props.$isDragging)
    ? 'hidden'
    : ''}; 

  transform: ${(props) =>
    `perspective(500px) rotateZ(90deg) rotateY(-50deg)  translate(${
      props.cardIndex * 2
    }px)`};
  z-index: ${(props) => 100 - props.cardIndex};
  filter: ${(props) =>
    props.showShadow === true
      ? 'drop-shadow(8px 0px 3px rgb(180, 110, 20))'
      : ''};
  grid-column: ${(props) => props.cardIndex + 2};
  ${(props) => {
    if (props.cardIndex <= 1) {
      if (props.isCursorOver) {
        return `
        filter: brightness(1.2);
        transform: perspective(500px) rotateZ(90deg) rotateY(-50deg)  translate3d(${
          -10 + props.cardIndex * 7
        }px, 0px, 10px);
        transition-property: transform;
        transition-duration: 0.5s;
        transition-timing-function: cubic-bezier(.32,1.46,.54,1.28);`;
      }
    }
  }}}

  display: ${(props) =>
    props.cardIndex <= 1 && props.$isClicked ? '' : 'block'};
  
  grid-row: 1;
  border-radius: 4px;
  height: 100%;
  border: 1px solid #555;
`;

export type TableCardProps = {
  totalCards: number;
};

export const TableCards: React.FC<TableCardProps> = ({ totalCards }) => {
  const [cardBackImg] = useWebpImage('back.png');

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DraggableType.CARD,
      options: {
        dropEffect: 'copy',
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const tableCardsRef = useRef<HTMLDivElement | null>(null);
  const [isCursorOver, setIsCursorOver] = useState<boolean>(false);
  const handleMouseOver = () => {
    setIsCursorOver(true);
  };
  const handleMouseOut = () => {
    setIsCursorOver(false);
  };

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const handleMouseDown = useCallback((event: MouseEvent | TouchEvent) => {
    setIsClicked(true);
  }, []);

  const handleTouch = useCallback((event: TouchEvent) => {
    setIsClicked(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicked(false);
  }, []);

  useEffect(() => {
    const node = tableCardsRef.current;
    if (node) {
      node.addEventListener('pointerenter', handleMouseOver);
      node.addEventListener('pointerleave', handleMouseOut);
      node.addEventListener('pointerdown', handleMouseDown);
      window.addEventListener('pointerup', handleMouseUp);

      window.addEventListener('dragstart', handleMouseUp);
      window.addEventListener('dragstart', handleMouseOut);
      window.addEventListener('dragend', handleMouseUp);
      window.addEventListener('dragend', handleMouseOut);

      return () => {
        node.removeEventListener('pointerenter', handleMouseOver);
        node.removeEventListener('pointerleave', handleMouseOut);
        node.removeEventListener('pointerdown', handleMouseDown);
        window.removeEventListener('pointerup', handleMouseUp);

        window.removeEventListener('dragstart', handleMouseUp);
        window.removeEventListener('dragstart', handleMouseOut);
        window.removeEventListener('dragend', handleMouseUp);
        window.removeEventListener('dragend', handleMouseOut);
      };
    }
  }, [handleMouseUp, handleMouseDown, handleTouch]);

  return (
    <>
      <CustomDragLayer visible={isClicked} dragItemType={DraggableType.CARD} />

      <CardsContainer ref={tableCardsRef} $isclicked={isClicked}>
        <Box
          ref={drag}
          sx={{
            width: '100%',
            marginBottom: '-10px',
            alignSelf: 'center',
            display: 'grid',
            gridTemplateColumns: '0.5fr repeat(10, 0px) 0.5fr',
          }}
        >
          <Box sx={{ gridColumn: '1' }} />
          {[...Array(totalCards)].map((x, index) => (
            <CardBack
              key={index}
              src={cardBackImg}
              cardIndex={index}
              showShadow={index === totalCards - 1}
              isCursorOver={isCursorOver}
              $isClicked={isClicked}
              $isDragging={isDragging}
            />
          ))}
          <Box sx={{ gridColumn: totalCards + 3 }} />
        </Box>
        <Typography variant="body2" alignSelf="center">
          {totalCards} cards
        </Typography>
      </CardsContainer>
    </>
  );
};
