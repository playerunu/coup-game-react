import { isVisible } from '@testing-library/user-event/dist/utils';
import { DraggableType } from 'constants/DraggableType';
import { useMousePosition } from 'hooks/useMousePosition';
import { FC, useEffect, useState } from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import styled from 'styled-components';
import { useWebpImage } from 'utils/image';

const DragLayerDiv = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const ImgContainer = styled.div<{
  isDragging: boolean;
  currentOffset: XYCoord | null;
}>`
  ${(props) => {
    if (!props.currentOffset || !props.isDragging) {
      return 'display: none';
    }

    let { x, y } = props.currentOffset;
    const transform = `translate(${x}px, ${y}px)`;

    return `
      transform: ${transform};
      WebkitTransform: ${transform};
    `;
  }}
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

export type CustomDragLayerProps = {
  visible: boolean;
  dragItemType: string;
};

const CardBack = styled.img<{ cardIndex: number }>`
  position: absolute;
  filter: brightness(1.2);
  z-index: ${(props) => 100 - props.cardIndex};
  transform: perspective(500px) rotateZ(90deg) rotateY(-50deg);

  margin-top: ${(props) => `${-25 + props.cardIndex * 4}px;`}
  margin-left: -40px;
  cursor: drag;

  border-radius: 4px;
  border: 1px solid #555;
`;

export const CustomDragLayer: FC<CustomDragLayerProps> = ({
  visible,
  dragItemType,
}) => {
  const [coinImg] = useWebpImage('coin.png');
  const [cardBackImg] = useWebpImage('back.png');

  const mousePosition = useMousePosition();

  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const renderItem = () => {
    switch (dragItemType) {
      case DraggableType.COIN:
        return <img src={coinImg} />;
      case DraggableType.CARD:
        return (
          <div>
            <CardBack src={cardBackImg} cardIndex={0} />
            <CardBack src={cardBackImg} cardIndex={1} />
          </div>
        );
      default:
        // TODO mayb throw exception
        return null;
    }
  };

  useEffect(() => {
    console.log(isDragging);
  }, [isDragging]);

  return (
    <DragLayerDiv>
      {/* <ImgContainer isDragging={isDragging} currentOffset={mousePosition}> */}
      <div style={getItemStyles(isDragging || visible, mousePosition)}>
        {renderItem()}
      </div>
      {/* </ImgContainer> */}
    </DragLayerDiv>
  );
};
