import React, {
  useRef,
} from 'react';
import { Box, Stack } from '@mui/material';
import styled from 'styled-components';
import { useWebpImage } from 'utils/image';
import { Draggable, DraggableType } from 'types/DraggableType';
import { useDraggableNode } from 'hooks/useDraggableNode';

const CardsContainer = styled(Stack)<{ $isclicked: boolean }>`
  justify-content: end;
  user-select: none;
  width: 160px;
  cursor: ${(props) => (props.$isclicked ? 'grabbing' : '')};
  :hover {
    cursor: ${(props) => (!props.$isclicked ? 'pointer' : '')};
  }
`;

const CardBack = styled.img<{
  cardIndex: number;
  showShadow: boolean;
  isCursorOver: boolean;
  isClicked: boolean;
  isDragging: boolean;
}>`
  // Hide the first two cards while dragging
  visibility: ${(props) =>
    props.cardIndex <= 1 && (props.isClicked || props.isDragging)
      ? 'hidden'
      : ''}; 
  
  // Stack the cards from bottom to top
  z-index: ${(props) => 100 - props.cardIndex};
  
  // Shadow for the last card in the stack
  filter: ${(props) =>
    props.showShadow === true
      ? 'drop-shadow(8px 0px 3px rgb(180, 110, 20))'
      : ''};

  // Rotate the cards 90 degreese and add 3d perpective
  transform: ${(props) =>
    `perspective(500px) rotateZ(90deg) rotateY(-50deg)  translate(${
      props.cardIndex * 2
    }px)`};
  
  // On hover effect for the first two cards in the stack
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
    props.cardIndex <= 1 && props.isClicked ? '' : 'block'};
  
  grid-row: 1;
  grid-column: ${(props) => props.cardIndex + 2};
  
  border-radius: 4px;
  height: 100%;
  border: 1px solid #555;
    
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 50px;
   }
`;

export type TableCardProps = {
  totalCards: number;
};

export const TableCards: React.FC<TableCardProps> = ({ totalCards }) => {
  const [cardBackImg] = useWebpImage('back.png');

  const tableCardsRef = useRef<HTMLDivElement | null>(null);
  const { isCursorOver, isClicked, isDragging, connectedDragSource } =
    useDraggableNode(tableCardsRef.current, Draggable.CARD as DraggableType);
  
  return (
    <>
      <CardsContainer ref={tableCardsRef} $isclicked={isClicked}>
        <Box
          ref={connectedDragSource}
          sx={{
            width: '100%',
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
              isClicked={isClicked}
              isDragging={isDragging}
            />
          ))}
          <Box sx={{ gridColumn: totalCards + 3 }} />
        </Box>
      </CardsContainer>
    </>
  );
};
