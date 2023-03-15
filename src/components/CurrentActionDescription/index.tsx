import React, { useCallback, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { selectCurrentActionText } from 'redux/game/slice';
import { useAppSelector } from 'redux/hooks';
import styled from 'styled-components';

const TextContainerContainer = styled.div<{
  $showNextActionAnimation: boolean;
}>`
  height: 40px;
  margin-top: 0;

  @keyframes new-action {
    0% {
      opacity: 0;
      margin-top: -40px;
    }
    15% {
      opacity: 1;
      margin-top: -35px;
    }
    25% {
      margin-top: -30px;
    }
    40% {
      margin-top: -25px;
    }
    50% {
      margin-top: -20px;
    }
    65% {
      margin-top: -15px;
    }
    75% {
      margin-top: -10px;
    }
    85% {
      margin-top: -5px;
    }
    100% {
      margin-top: -0px;
    }
  }

  /* @keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name */
  animation: ${(props) =>
    props.$showNextActionAnimation
      ? '0.5s linear 0s normal none 1 new-action'
      : ''};
`;

export const CurrentActionDescription: React.FC = () => {
  const currentActionText = useAppSelector(selectCurrentActionText);
  const [toggleTextAnimation, setToggleTextAnimation] =
    useState<boolean>(false);
  const [firstLine, setFirstLine] = useState<string>('');

  useEffect(() => {
    setToggleTextAnimation(true);
    setFirstLine(currentActionText);
  }, [currentActionText]);

  const onTextTransitionEnd = useCallback(() => {
    setToggleTextAnimation(false);
  }, []);

  return (
    <TextContainerContainer
      $showNextActionAnimation={toggleTextAnimation}
      onAnimationEnd={() => onTextTransitionEnd()}
    >
      <Typography variant="h4" align="center">
        {firstLine}
      </Typography>
    </TextContainerContainer>
  );
};
