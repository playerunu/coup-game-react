import React  from 'react';
import { Stack } from '@mui/material';
import { CURSOR_BACKGROUND, CURSOR_BORDER } from 'constants/theme';
import { useDrop } from 'react-dnd';
import {
  setPendingHeroPlayerMove,
} from 'redux/game/slice';
import { useAppDispatch } from 'redux/hooks';
import styled from 'styled-components';
import { ActionDropTargetConfig } from 'types/DraggableType';

export type ConfirmActionTargetProps = {
  config: ActionDropTargetConfig;
};

const LogoImg = styled.img<{backgroundColor: string}>`
  width: 32px;
  backgroundColor: ${(props) => props.backgroundColor};
`;

export const ConfirmActionTarget: React.FC<ConfirmActionTargetProps> = ({ config }) => {
  const dispatch = useAppDispatch();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: config.dragItemType,
      drop: () => {
        dispatch(setPendingHeroPlayerMove(config.actionType));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [dispatch]
  );

  // useEffect(() => {
  //   if (isOver) {
  //     if (coinsNumber === 1) {
  //       dispatch(setPendingHeroPlayerMove(ActionType.TakeOneCoin));
  //     } else if (coinsNumber === 2) {
  //       dispatch(setPendingHeroPlayerMove(ActionType.TakeTwoCoins));
  //     } else if (coinsNumber === 3) {
  //       dispatch(setPendingHeroPlayerMove(ActionType.TakeThreeCoins));
  //     }
  //   } else {
  //     dispatch(cancelPendingHeroPlayerMove());
  //   }
  // }, [dispatch, isOver, coinsNumber]);



  const BackgroundComponent = config?.backgroundComponent;

  return (
    <Stack
      ref={drop}
      sx={{
        width: '90px',
        height: '90px',

        background: `${CURSOR_BACKGROUND}`,
        filter: 'brightness(1.1)',

        border: `1px solid ${CURSOR_BORDER}`,
        borderRadius: '50%',

        alignItems: 'center',
        justifyContent: 'center',
      }}
    >   
       {(config.logoImgSrc && config.backgroundColor) && <LogoImg src={config.logoImgSrc} alt={'action logo'} backgroundColor={config.backgroundColor} />}
        {/* {BackgroundComponent} */}
    </Stack>
  );
};
