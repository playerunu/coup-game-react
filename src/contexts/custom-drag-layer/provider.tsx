import React, { useState } from 'react';
import { DraggableType } from 'types/DraggableType';
import { CustomDragLayerContext } from './context';

type CustomDragLayerProviderProps = {
  children: React.ReactNode;
};

export const CustomDragLayerProvider: React.FC<
  CustomDragLayerProviderProps
> = ({ children }) => {
  const [dragItemType, setDragItemType] = useState<DraggableType>();
  const [isClicked, setIsClicked] = useState<boolean>();
  const [isCursorOver, setIsCursorOver] = useState<boolean>();

  return (
    <CustomDragLayerContext.Provider
      value={{
        isClicked: !!isClicked,
        isCursorOver: !!isCursorOver,
        dragItemType,

        setIsClicked,
        setIsCursorOver,
        setDragItemType,
      }}
    >
      {children}
    </CustomDragLayerContext.Provider>
  );
};
