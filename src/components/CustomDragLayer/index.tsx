import { CustomDragLayerContext } from 'contexts/custom-drag-layer/context';
import { useMousePosition } from 'hooks/useMousePosition';
import { useContext } from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import styled from 'styled-components';
import { Draggable } from 'types/DraggableType';
import { useWebpImage } from 'utils/image';

const DragLayerDiv = styled.div<{ $isDragging: boolean }>`
  //opacity: ${({ $isDragging }) => ($isDragging ? 1 : 0)};
  //transition: opacity 0.15s;
  //background: rgba(0, 0, 0, 0.25);

  position: fixed;
  color: #fff;
  pointer-events: none;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
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
    transform,
    WebkitTransform: transform,
  };
};

const CardBack = styled.img<{ cardIndex: number }>`
  position: absolute;
  
  z-index: ${(props) => 100 - props.cardIndex};
  transform: perspective(500px) rotateZ(90deg) rotateY(-50deg);

  margin-top: ${(props) => `${-25 + props.cardIndex * 4}px;`}
  margin-left: -40px;
  cursor: drag;

  border-radius: 4px;
  border: 1px solid #555;
`;

export const CustomDragLayer: React.FC = () => {
  // We use dragItemType from the context instead of the {itemType} from the useDragLayer()
  // because we want to show the image preview on click as well, before the drag starts
  const { isVisible, dragItemType } = useContext(CustomDragLayerContext);

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

  const renderItem = () => {
    switch (dragItemType) {
      case Draggable.COIN:
        return <img src={coinImg} alt={'coin'} />;
      case Draggable.CARD:
        return (
          <div>
            <CardBack src={cardBackImg} cardIndex={0} alt={'card back'} />
            <CardBack src={cardBackImg} cardIndex={1} alt={'card back'} />
          </div>
        );
      default:
        // TODO mayb throw exception
        return null;
    }
  };

  return (
    <DragLayerDiv $isDragging={isDragging || isVisible}>
      <div style={getItemStyles(isDragging || isVisible, mousePosition)}>
        {renderItem()}
      </div>
    </DragLayerDiv>
  );
};
