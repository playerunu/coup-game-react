import { createContext } from 'react';
import { DraggableType } from 'types/DraggableType';

export type DragLayerContext = {
  isVisible: boolean;
  dragItemType?: DraggableType;

  setIsVisible: (visible: boolean) => void;
  setDragItemType: (dragItemType: DraggableType) => void;
};

export const DRAG_LAYER_CONTEXT_DEFAULT = {
  isVisible: false,
  setIsVisible: () => {},
  setDragItemType: () => {},
};

export const CustomDragLayerContext = createContext<DragLayerContext>(
  DRAG_LAYER_CONTEXT_DEFAULT
);
