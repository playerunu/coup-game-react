import React, { useEffect } from 'react';
import { GameTable } from 'components/GameTable';
import { GameMessage } from 'types/GameMessage';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { useSendMessageMutation, useWsListenerQuery } from 'redux/game/api';
import {
  selectGameStarted,
  selectHeroPlayerName,
  setHeroPlayerName,
} from 'redux/game/slice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Box, Typography } from '@mui/material';
import { BACKGROUND_COLOR } from 'constants/theme';

export const Level: React.FC = () => {
  const dispatch = useAppDispatch();

  const gameStarted = useAppSelector(selectGameStarted);
  const heroPlayerName = useAppSelector(selectHeroPlayerName);

  const [sendMessage] = useSendMessageMutation();
  useWsListenerQuery();

  useEffect(() => {
    const heroPlayerName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
    });

    sendMessage({
      messageType: GameMessage[GameMessage.PlayerJoined],
      data: {
        name: heroPlayerName,
      },
    });

    dispatch(setHeroPlayerName(heroPlayerName));
  }, [dispatch, sendMessage]);

  return (
    <Box sx={{ backgroundColor: BACKGROUND_COLOR }}>
      {gameStarted ? (
        <GameTable />
      ) : (
        <>
          <Typography variant="h3"> Welcome {heroPlayerName}!</Typography>
          <Typography variant="h4"> Waiting for game to start...</Typography>
        </>
      )}
    </Box>
  );
};
