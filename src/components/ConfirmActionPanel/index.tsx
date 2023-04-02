import { Theme, Typography, useMediaQuery } from '@mui/material';
import { CoinsAction } from 'components/CoinsAction';
import { ConfirmActionTarget } from 'components/ConfirmActionTarget';
import { DUKE_LOGO_COLOR } from 'constants/theme';
import { CustomDragLayerContext } from 'contexts/custom-drag-layer/context';
//import { SMALL_SCREEN_THEME_BREAKPOINT } from 'constants/theme';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDragLayer } from 'react-dnd';
import { selectCurrentActionText } from 'redux/game/slice';
import { useAppSelector } from 'redux/hooks';
import styled from 'styled-components';
import { ActionType } from 'types/Action';
import { ActionDropTargetConfig, DraggableType } from 'types/DraggableType';
import { PlayerMove } from 'types/PlayerMove';

const ConfirmActionContainer = styled.div<{
    $showAnimation: boolean;
  }>`
    display: flex;
    flex-direction: row;
    margin-top: 0;
  
    @keyframes new-action {
      0% {
        opacity: 0;
        margin-bottom: -40px;
      }
      15% {
        opacity: 1;
        margin-bottom: -35px;
      }
      25% {
        margin-bottom: -30px;
      }
      40% {
        margin-bottom: -25px;
      }
      50% {
        margin-bottom: -20px;
      }
      65% {
        margin-bottom: -15px;
      }
      75% {
        margin-bottom: -10px;
      }
      85% {
        margin-bottom: -5px;
      }
      100% {
        margin-bottom: -0px;
      }
    }
  
    /* @keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name */
    animation: ${(props) =>
      props.$showAnimation
        ? '0.5s linear 0s normal none 1 new-action'
        : ''};
  `;
 

const ACTION_DROP_TARGET_CONFIGS: Record<DraggableType, ActionDropTargetConfig[]> = {
  [DraggableType.COIN]: [
    {
      actionName: 'Income',
      actionType: ActionType.TakeOneCoin,
      dragItemType: DraggableType.COIN,

      backgroundComponent: <CoinsAction coinsNumber={1}/>,
    },
    {
      actionName: 'Foreign Aid',
      actionType: ActionType.TakeTwoCoins,
      dragItemType: DraggableType.COIN,

      backgroundComponent: <CoinsAction coinsNumber={2}/>,
    },
    {
      actionName: 'Tax',
      actionType: ActionType.TakeThreeCoins,
      dragItemType: DraggableType.COIN,

      backgroundComponent: <CoinsAction coinsNumber={3}/>,
      logoImgSrc: 'duke-logo-transparent.svg',
      backgroundColor: DUKE_LOGO_COLOR,
    }
  ],
  [DraggableType.CARD]: [
  ],
}

export const ConfirmActionPanel: React.FC = ({}) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const currentActionText = useAppSelector(selectCurrentActionText);
    const [toggleTextAnimation, setToggleTextAnimation] =
      useState<boolean>(false);
    const [firstLine, setFirstLine] = useState<string>('');
  
    useEffect(() => {
      setToggleTextAnimation(true);
    }, [currentActionText]);
  
    const onTextTransitionEnd = useCallback(() => {
      setToggleTextAnimation(false);
    }, []);
  

  // TODO
/*
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      canDrop: () => game.canMoveKnight(x, y),
      drop: () => game.moveKnight(x, y),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [game],
  )

  1. window.addEventListener('dragstart => show animation
  2. window.addEventListener('dragend => hide animation
  3. get draggable type from context => based on that show possible ations panels
  4. each panel will have an useDrop()
    4.1 drop() function will confirm a pending action
    4.2 hover() function will set a pending action
*/



// useEffect(() => {
//   window.addEventListener('dragstart', () => {
//     setToggleTextAnimation(true);
//   });
// }, []);

const { isClicked, dragItemType } = useContext(CustomDragLayerContext);
const { isDragging } = useDragLayer((monitor) => ({
  isDragging: monitor.isDragging(),
}));


const [actionDropTargets, setActionDropTargets] = useState<ActionDropTargetConfig[]>([]);
useEffect(() => {
  if ((isDragging || isClicked ) && dragItemType !== undefined) {
    setActionDropTargets([...ACTION_DROP_TARGET_CONFIGS[dragItemType]]);
  } else {
    setActionDropTargets([]);
  }
}, [dragItemType, isDragging, isClicked]);
  
  return (
    <ConfirmActionContainer
      $showAnimation={toggleTextAnimation}
    >
       {actionDropTargets.map((config, actionIndex) => (
        <ConfirmActionTarget
         config = {config}
        />
      ))}
    </ConfirmActionContainer>
  );
}