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
import { setHeroPlayerName } from 'redux/game/slice';
import { useAppDispatch } from 'redux/hooks';

export const Level: React.FC = () => {
  const dispatch = useAppDispatch();

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

  return <GameTable />;
};
