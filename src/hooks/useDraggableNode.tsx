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
    dragItemType,
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
      setDragItemType(draggableType);
      setIsCursorOver(true);
    }
  }, [isDragging, setIsCursorOver, setDragItemType, draggableType]);

  const handlePointerOut = useCallback(() => {
    if (!isDragging) {
      setDragItemType(undefined);
      setIsCursorOver(false);
    }
  }, [isDragging, setIsCursorOver, setDragItemType]);

  const handlePointerDown = useCallback(() => {
    setDragItemType(draggableType);
    setIsClicked(true);

    dispatch(setPendingHeroPlayerMove(ActionType.Exchange));
  }, [setIsClicked, setDragItemType, draggableType, dispatch]);

  const handlePointerUp = useCallback(() => {
    setIsClicked(false);
    setIsCursorOver(false);
    setDragItemType(undefined);

    dispatch(cancelPendingHeroPlayerMove());
  }, [setIsClicked, setDragItemType, dispatch]);

  const handleDragStart = useCallback(() => {
    setIsClicked(false);
    setIsCursorOver(false);
  }, [setIsClicked, setDragItemType, dispatch]);

  const handleDragEnd = useCallback(() => {
    setIsClicked(false);
    setIsCursorOver(false);
    setDragItemType(undefined);
    dispatch(cancelPendingHeroPlayerMove());
  }, [setIsClicked, setDragItemType, dispatch]);


  useEffect(() => {
    if (node) {
      node.addEventListener('pointerenter', handlePointerOver);
      node.addEventListener('pointerleave', handlePointerOut);

      node.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointerup', handlePointerUp);

      node.addEventListener('dragstart', handleDragStart);
      node.addEventListener('dragend', handleDragEnd);

      return () => {
        node.removeEventListener('pointerenter', handlePointerOver);
        node.removeEventListener('pointerleave', handlePointerOut);
        
        node.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);

        node.removeEventListener('dragstart', handleDragStart);
        node.removeEventListener('dragend', handleDragEnd);
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
    isCursorOver : isCursorOver && dragItemType === draggableType,
    isClicked: isClicked && dragItemType === draggableType,
    isDragging: isDragging,
    connectedDragSource,
  };
};
