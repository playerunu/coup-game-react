import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWebpImage } from 'utils/image';
import { Box, Stack, Typography } from '@mui/material';
import styled from 'styled-components';
import { useAppSelector } from 'redux/hooks';
import { selectIsHeroPlayerTurn } from 'redux/game/slice';
import { DraggableType } from 'constants/DraggableType';
import { useDrag, useDragLayer, XYCoord } from 'react-dnd';
import { CustomDragLayer } from 'components/CustomDragLayer';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useMousePosition } from 'hooks/useMousePosition';

const DragLayerDiv = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const CardsContainer = styled(Stack)<{ isClicked: boolean }>`
  justify-content: end;
  user-select: none;
  width: 160px;
  cursor: ${(props) => (props.isClicked ? 'grabbing' : '')};
`;

// TODO make this a component
const CardBack = styled.img<{
  cardIndex: number;
  showShadow: boolean;
  isCursorOver: boolean;
  isClicked: boolean;
}>`
visibility: ${(props) =>
  props.cardIndex <= 1 && props.isClicked ? 'hidden' : ''}; 

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
        transition-duration: 1s;
        transition-timing-function: cubic-bezier(.32,1.46,.54,1.28);`;
      }
    }
  }}}

  display: ${(props) =>
    props.cardIndex <= 1 && props.isClicked ? '' : 'block'};
  
   
   

  grid-row: 1;
  border-radius: 4px;
  height: 100%;
  border: 1px solid #555;
`;

const getItemStyles = (isDragging: boolean, currentOffset: XYCoord | null) => {
  if (!currentOffset || !isDragging) {
    return {
      display: 'none',
    };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;

  return {
    // left: x,
    // top: y,
    transform,
    WebkitTransform: transform,
  };
};

export type TableCardProps = {
  totalCards: number;
};

export const TableCards: React.FC<TableCardProps> = ({ totalCards }) => {
  const isHeroPlayerTurn = useAppSelector(selectIsHeroPlayerTurn);
  const mousePosition = useMousePosition();

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

  const { itemType, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const tableCardsRef = useRef<HTMLDivElement | null>(null);
  const [isCursorOver, setIsCursorOver] = useState<boolean>(false);
  const handleMouseOver = () => setIsCursorOver(true);
  const handleMouseOut = () => setIsCursorOver(false);

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      console.log(event.offsetX, '   ', event.offsetY);
      setIsClicked(true);
    },
    [isClicked]
  );

  const handleMouseUp = useCallback(() => {
    setIsClicked(false);
  }, [isClicked]);

  useEffect(() => {
    const node = tableCardsRef.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      node.addEventListener('dragstop', handleMouseOut);

      node.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('dragend', handleMouseUp);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
        node.removeEventListener('dragstop', handleMouseOut);

        node.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('dragend', handleMouseUp);
      };
    }
  }, [handleMouseDown]);

  return (
    <>
      <CustomDragLayer visible={isClicked} dragItemType={DraggableType.CARD} />

      <CardsContainer ref={tableCardsRef} isClicked={isClicked}>
        <Box
          ref={drag}
          sx={{
            width: '100%',
            marginBottom: '-10px',
            alignSelf: 'center',
            display: 'grid',
            gridTemplateColumns: '0.5fr repeat(10, 0px) 0.5fr',
            // ...(isHeroPlayerTurn && {
            //   '&:hover': {
            //     filter: 'sepia(50)',
            //   },
            // }),
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
