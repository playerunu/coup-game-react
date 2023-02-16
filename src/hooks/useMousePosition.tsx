import React, { useEffect } from 'react';
import { XYCoord } from 'react-dnd';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState<XYCoord | null>(
    null
  );

  useEffect(() => {
    const updateFromMouseEvent = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    const updateFromTouchEvent = (ev: TouchEvent) => {
      if (!!ev.touches[0]) {
        const touch = ev.touches[0];
        setMousePosition({ x: touch.clientX, y: touch.clientY });
      }
    };

    window.addEventListener('touchstart', updateFromTouchEvent);
    window.addEventListener('touchmove', updateFromTouchEvent);

    window.addEventListener('mousemove', updateFromMouseEvent);
    window.addEventListener('dragover', updateFromMouseEvent);
    window.addEventListener('dragstart', updateFromMouseEvent);

    return () => {
      window.removeEventListener('touchmove', updateFromTouchEvent);
      window.removeEventListener('touchstart', updateFromTouchEvent);

      window.removeEventListener('mousemove', updateFromMouseEvent);
      window.removeEventListener('dragover', updateFromMouseEvent);
      window.removeEventListener('dragstart', updateFromMouseEvent);
    };
  }, []);

  return mousePosition;
};
