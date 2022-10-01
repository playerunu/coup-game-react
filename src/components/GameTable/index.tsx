import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
//import useScreenOrientation from "hooks/useScreenOrientation";
import useWindowSize from 'hooks/useWindowSize';
import { useAppSelector } from 'redux/hooks';
import { selectHeroPlayerName, selectPlayers } from 'redux/game/slice';
import { Player } from 'types/Player';
import { TablePlayer } from 'components/TablePlayer';

export const GameTable: React.FC = () => {
  //const screenOrientation = useScreenOrientation();
  const [, windowHeight] = useWindowSize();

  // const isLandscape =
  //   screenOrientation === "landscape-primary" ||
  //   screenOrientation === "landscape-secondary";

  const players = useAppSelector(selectPlayers);
  const heroPlayerName = useAppSelector(selectHeroPlayerName);

  const [tablePlayers, setTablePlayers] = useState<Player[]>([]);
  const [heroPlayer, setHeroPlayer] = useState<Player | undefined>(undefined);

  useEffect(() => {
    if (heroPlayerName) {
      const hero = players.find((p) => p.name === heroPlayerName);
      if (hero) {
        setHeroPlayer(hero);

        if (players.length > 1 && hero?.gamePosition !== undefined) {
          const sortedPlayers: Player[] = [];
          for (
            let tableIndex = 0, gameIndex = hero.gamePosition;
            tableIndex < players.length;
            tableIndex++, gameIndex = (gameIndex + 1) % players.length
          ) {
            console.log('Searcginh for ', gameIndex);
            const player = players.find((p) => p.gamePosition === gameIndex);
            if (player) {
              console.log('Found', player);
              sortedPlayers.push(player);
            } else {
              console.log('Didnst find it wtf');
            }
          }
          setTablePlayers(sortedPlayers);
        }
      }
    }
  }, [players, heroPlayerName]);

  return (
    <>
      <Box
        display="flex"
        height={windowHeight}
        width="100vw"
        flexDirection="column"
      >
        {tablePlayers.length >= 4 && (
          <Box
            display="flex"
            flex={0.2}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <TablePlayer player={tablePlayers[3]} />
          </Box>
        )}

        <Box
          display="flex"
          flex={0.6}
          justifyContent="space-between"
          alignItems="center"
        >
          {tablePlayers.length >= 2 && (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
              {tablePlayers.length >= 3 && (
                <TablePlayer player={tablePlayers[2]} />
              )}

              <TablePlayer player={tablePlayers[1]} />
            </Box>
          )}
          {tablePlayers.length >= 5 && (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
              {tablePlayers.length === 6 && (
                <TablePlayer player={tablePlayers[5]} />
              )}

              <TablePlayer player={tablePlayers[4]} />
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          flex={0.2}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {heroPlayer && <TablePlayer player={heroPlayer} />}
        </Box>
      </Box>
    </>
  );
};
