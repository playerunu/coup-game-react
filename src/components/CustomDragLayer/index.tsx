import { Stack } from '@mui/material';
import {
  CURSOR_BACKGROUND,
  CURSOR_BORDER,
  SMALL_SCREEN_THEME_BREAKPOINT,
} from 'constants/theme';
import { CustomDragLayerContext } from 'contexts/custom-drag-layer/context';
import { useMousePosition } from 'hooks/useMousePosition';
import { CSSProperties, useContext } from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import styled from 'styled-components';
import { Draggable } from 'types/DraggableType';
import { useWebpImage } from 'utils/image';

// opacity: ${({ $isDragging }) => ($isDragging ? 1 : 0)};
//transition: opacity 0.15s;
//background: rgba(0, 0, 0, 0.25);
const DragLayerDiv = styled.div`
  position: fixed;
  color: #fff;
  pointer-events: none;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const getCursorContainerStyles = (
  currentOffset: XYCoord | null
): CSSProperties => {
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }

  let { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    position: 'absolute',
    transform,
  };
};

const CardBack = styled.img<{ cardIndex: number }>`
  position: absolute;

  z-index: ${(props) => 100 - props.cardIndex};
  transform: perspective(500px) rotateZ(90deg) ;

  margin-top: ${(props) => `${props.cardIndex * 4}px;`}

  border-radius: 4px;
  border: 1px solid #555;

  background: rgba(157, 132, 255, 0.16);

  width: 40px;
  // ${({ theme }) => theme.breakpoints.down(SMALL_SCREEN_THEME_BREAKPOINT)} {
  //  TODO: fix the card size on small screens
  //   width: 50px;
  //  }
`;

const Coin = styled.img``;

export const CustomDragLayer: React.FC = () => {
  // We use dragItemType from the context instead of the {itemType} from the useDragLayer()
  // because we want to show the image preview on click as well, before the drag starts
  const { isClicked, isCursorOver, dragItemType } = useContext(
    CustomDragLayerContext
  );

  const [coinImg] = useWebpImage('coin.png');
  const [cardBackImg] = useWebpImage('back.png');

  const mousePosition = useMousePosition();

  const { isDragging } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const renderCursor = () => {
    if (!(isDragging || isClicked)) {
      return null;
    }

    switch (dragItemType) {
      case Draggable.COIN:
        return <Coin src={coinImg} alt={'coin'} />;

      case Draggable.CARD:
        return (
          <>
            <CardBack
              key={'card1'}
              src={cardBackImg}
              cardIndex={0}
              alt={'card back'}
            />
            <CardBack
              key={'card2'}
              src={cardBackImg}
              cardIndex={1}
              alt={'card back'}
            />
          </>
        );
      default:
        // TODO maybe throw exception
        return null;
    }
  };

  return (
    <DragLayerDiv>
      {/* This div needs to be rendered without styled-components in order to 
      avoid generating a new class name on every render */}
      <div style={getCursorContainerStyles(mousePosition)}>
        <Stack
          sx={{
            width: isCursorOver || isDragging ? '90px' : '60px',
            height: isCursorOver || isDragging ? '90px' : '60px',
            transition: 'width 0.5s, height 0.5s',

            // To center the cursor
            marginLeft: isCursorOver || isDragging ? '-45px' : '-30px',
            marginTop: isCursorOver || isDragging ? '-45px' : '-30px',

            background: `${CURSOR_BACKGROUND}`,
            filter: 'brightness(1.1)',

            border: `1px solid ${CURSOR_BORDER}`,
            borderRadius: '50%',

            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderCursor()}
        </Stack>
      </div>
    </DragLayerDiv>
  );
};
