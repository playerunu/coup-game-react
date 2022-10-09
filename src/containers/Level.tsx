import React, { useEffect } from 'react';
import { GameTable } from 'components/GameTable';
import { GameMessage } from 'types/GameMessage';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { useSendMessageMutation, useWsListenerQuery } from 'redux/game/api';
import {
  selectGameStarted,
  selectHeroPlayerName,
  setHeroPlayerName,
} from 'redux/game/slice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Typography } from '@mui/material';

export const Level: React.FC = () => {
  const dispatch = useAppDispatch();

  const gameStarted = useAppSelector(selectGameStarted);
  const heroPlayerName = useAppSelector(selectHeroPlayerName);

  const [sendMessage] = useSendMessageMutation();
  useWsListenerQuery();

  useEffect(() => {
    const heroPlayerName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    sendMessage({
      messageType: GameMessage[GameMessage.PlayerJoined],
      data: {
        name: heroPlayerName,
      },
    });

    dispatch(setHeroPlayerName(heroPlayerName));
  }, [dispatch, sendMessage]);

  return gameStarted ? (
    <GameTable />
  ) : (
    <>
      <Typography variant="h3"> Welcome {heroPlayerName}!</Typography>
      <Typography variant="h4"> Waiting for game to start...</Typography>
    </>
  );
};
