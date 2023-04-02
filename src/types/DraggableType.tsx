import { ActionType } from "./Action";

export enum DraggableType {
  COIN = 'coin',
  CARD = 'card',
};

export type ActionDropTargetConfig = {
  actionName: string;
  actionType: ActionType;
  dragItemType: DraggableType;
  
  logoImgSrc?: string;
  backgroundColor?: string;
  backgroundComponent?: React.ReactNode;
   
};
