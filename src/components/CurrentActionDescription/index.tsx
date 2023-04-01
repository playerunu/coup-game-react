import React, { useCallback, useEffect, useState } from 'react';
import { Theme, Typography, useMediaQuery } from '@mui/material';
import { selectCurrentActionText } from 'redux/game/slice';
import { useAppSelector } from 'redux/hooks';
import styled from 'styled-components';
import { SMALL_SCREEN_THEME_BREAKPOINT } from 'constants/theme';

const TextContainerContainer = styled.div<{
  $showNextActionAnimation: boolean;
}>`
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
      margin-top: 0px;
    }
  }

  /* @keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name */
  animation: ${(props) =>
    props.$showNextActionAnimation
      ? '0.5s linear 0s normal none 1 new-action'
      : ''};
`;

export const CurrentActionDescription: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down(SMALL_SCREEN_THEME_BREAKPOINT));

  const currentActionText = useAppSelector(selectCurrentActionText);
  const [toggleTextAnimation, setToggleTextAnimation] =
    useState<boolean>(false);

  useEffect(() => {
    // Toggle animatoin on each text change
    setToggleTextAnimation(true);
  }, [currentActionText]);

  const onTextTransitionEnd = useCallback(() => {
    setToggleTextAnimation(false);
  }, []);

  return (
    <TextContainerContainer
      $showNextActionAnimation={toggleTextAnimation}
      onAnimationEnd={() => onTextTransitionEnd()}
    >
      <Typography variant={isSmallScreen ? 'h5': 'h3'} align="center">
        {currentActionText}
      </Typography>
    </TextContainerContainer>
  );
};
