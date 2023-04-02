import { createContext } from 'react';
import { DraggableType } from 'types/DraggableType';

export type DragLayerContext = {
  isClicked: boolean;
  isCursorOver: boolean;
  dragItemType?: DraggableType;

  setIsClicked: (clicked: boolean) => void;
  setIsCursorOver: (hovered: boolean) => void;
  setDragItemType: (dragItemType?: DraggableType) => void;
};

export const DRAG_LAYER_CONTEXT_DEFAULT = {
  isClicked: false,
  isCursorOver: false,

  setIsClicked: () => {},
  setIsCursorOver: () => {},
  setDragItemType: () => {},
};

export const CustomDragLayerContext = createContext<DragLayerContext>(
  DRAG_LAYER_CONTEXT_DEFAULT
);
