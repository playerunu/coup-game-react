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
  const [isVisible, setIsVisible] = useState<boolean>();

  return (
    <CustomDragLayerContext.Provider
      value={{
        isVisible: !!isVisible,
        dragItemType,
        setIsVisible,
        setDragItemType,
      }}
    >
      {children}
    </CustomDragLayerContext.Provider>
  );
};
