import { FC } from 'react';
import { useDragLayer } from 'react-dnd';
import styled from 'styled-components';

const DragLayerDiv = styled.div<{ $isDragging: boolean }>`
  position: fixed;
  z-index: 9999;
  top: -300%;
  left: -150%;
  height: 600%;
  width: 600%;
  animation: grain 7s steps(10) infinite;
  background-image: url(/noise.png);
  background-size: 200px;
  background-repeat: repeat;
  opacity: 0.45;
  pointer-events: none;

  @keyframes grain {
    0%,
    100% {
      background-position: 0 0;
    }

    10% {
      background-position: -5% -10%;
    }

    20% {
      background-position: -15% 5%;
    }

    30% {
      background-position: 7% -25%;
    }

    40% {
      background-position: 20% 25%;
    }

    50% {
      background-position: -25% 10%;
    }

    60% {
      background-position: 15% 5%;
    }

    70% {
      background-position: 0% 15%;
    }

    80% {
      background-position: 25% 35%;
    }

    90% {
      background-position: -10% 10%;
    }
  }
`;

export const NoiseBackground: FC = () => {
  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  return <DragLayerDiv $isDragging={isDragging} />;
};
