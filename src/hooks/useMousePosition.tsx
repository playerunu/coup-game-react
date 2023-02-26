import React, { useEffect } from 'react';
import { XYCoord } from 'react-dnd';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState<XYCoord | null>(
    null
  );

  useEffect(() => {
    const updateFromPointerEvent = (ev: PointerEvent | MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('pointerdown', updateFromPointerEvent);
    window.addEventListener('pointermove', updateFromPointerEvent);

    window.addEventListener('dragover', updateFromPointerEvent);
    window.addEventListener('dragstart', updateFromPointerEvent);

    return () => {
      window.removeEventListener('pointerdown', updateFromPointerEvent);
      window.removeEventListener('pointermove', updateFromPointerEvent);

      window.removeEventListener('dragover', updateFromPointerEvent);
      window.removeEventListener('dragstart', updateFromPointerEvent);
    };
  }, []);

  return mousePosition;
};
