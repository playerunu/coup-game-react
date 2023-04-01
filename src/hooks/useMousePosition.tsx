import { useEffect, useState } from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<XYCoord | null>(null);

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  useEffect(() => {
    const updateFromPointerEvent = (ev: PointerEvent | MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('pointerdown', updateFromPointerEvent);
    window.addEventListener('pointermove', (ev) => {
      // TODO move this to another function
      // this is necessary to prevent the mouse position from updating while dragging
      // and dispatching duplicate updates, resulting in a flickering cursor
      if (!isDragging) updateFromPointerEvent(ev);
    });

    window.addEventListener('dragover', updateFromPointerEvent);
    window.addEventListener('dragstart', updateFromPointerEvent);

    return () => {
      window.removeEventListener('pointerdown', updateFromPointerEvent);
      window.removeEventListener('pointermove', updateFromPointerEvent);

      window.removeEventListener('dragover', updateFromPointerEvent);
      window.removeEventListener('dragstart', updateFromPointerEvent);
    };
  }, [isDragging]);

  return mousePosition;
};
