import { CustomDragLayerContext } from 'contexts/custom-drag-layer/context';
import { useCallback, useContext, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  setPendingHeroPlayerMove,
  cancelPendingHeroPlayerMove,
} from 'redux/game/slice';
import { useAppDispatch } from 'redux/hooks';
import { ActionType } from 'types/Action';
import { DraggableType } from 'types/DraggableType';

export const useDraggableNode = (
  node: HTMLDivElement | null,
  draggableType: DraggableType
) => {
  const dispatch = useAppDispatch();
  const {
    isCursorOver,
    isClicked,
    setIsCursorOver,
    setIsClicked,
    setDragItemType,
  } = useContext(CustomDragLayerContext);

  const [{ isDragging }, connectedDragSource, preview] = useDrag(
    () => ({
      type: draggableType,
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

  const handlePointerOver = useCallback(() => {
    if (!isDragging) {
      setIsCursorOver(true);
    }
  }, [isDragging, setIsCursorOver]);

  const handlePointerOut = useCallback(() => {
    if (!isDragging) {
      setIsCursorOver(false);
    }
  }, [isDragging, setIsCursorOver]);

  const handlePointerDown = useCallback(() => {
    setDragItemType(draggableType);
    setIsClicked(true);
    dispatch(setPendingHeroPlayerMove(ActionType.Exchange));
  }, [setIsClicked, setDragItemType, draggableType, dispatch]);

  const handlePointerUp = useCallback(() => {
    setIsClicked(false);

    // TODO
    dispatch(cancelPendingHeroPlayerMove());
  }, [setIsClicked, dispatch]);

  useEffect(() => {
    if (node) {
      node.addEventListener('pointerenter', handlePointerOver);
      node.addEventListener('pointerleave', handlePointerOut);

      node.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointerup', handlePointerUp);

      window.addEventListener('dragstart', handlePointerUp);
      window.addEventListener('dragend', handlePointerUp);

      window.addEventListener('dragstart', handlePointerOut);
      window.addEventListener('dragend', handlePointerOut);

      return () => {
        node.removeEventListener('pointerenter', handlePointerOver);
        node.removeEventListener('pointerleave', handlePointerOut);
        node.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);

        window.removeEventListener('dragstart', handlePointerUp);
        window.removeEventListener('dragstart', handlePointerOut);
        window.removeEventListener('dragend', handlePointerUp);
        window.removeEventListener('dragend', handlePointerOut);
      };
    }
  }, [
    handlePointerUp,
    handlePointerDown,
    handlePointerOut,
    handlePointerOver,
    node,
  ]);

  return {
    isCursorOver,
    isClicked,
    isDragging,
    connectedDragSource,
  };
};
