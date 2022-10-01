import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
//import useScreenOrientation from "hooks/useScreenOrientation";
import useWindowSize from 'hooks/useWindowSize';
import { useAppSelector } from 'redux/hooks';
import {
  selectHeroPlayerName,
  selectPlayers,
  selectTableCoins,
} from 'redux/game/slice';
import { Player } from 'types/Player';
import { TablePlayer } from 'components/TablePlayer';
import { TableCoins } from 'components/TableCoins';

export const GameTable: React.FC = () => {
  //const screenOrientation = useScreenOrientation();
  const [, windowHeight] = useWindowSize();

  // const isLandscape =
  //   screenOrientation === "landscape-primary" ||
  //   screenOrientation === "landscape-secondary";

  const players = useAppSelector(selectPlayers);
  const heroPlayerName = useAppSelector(selectHeroPlayerName);
  const tableCoins = useAppSelector(selectTableCoins);

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
        <Box
          display="flex"
          flex={0.2}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {/* 4TH PLAYER */}
          {tablePlayers.length >= 4 && <TablePlayer player={tablePlayers[3]} />}
        </Box>

        <Box
          display="flex"
          flex={0.6}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            rowGap={'10px'}
            height="100%"
          >
            {/* 3RD PLAYER */}
            {tablePlayers.length >= 3 && (
              <TablePlayer player={tablePlayers[2]} />
            )}

            {/* 2ND PLAYER */}
            {tablePlayers.length >= 2 && (
              <TablePlayer player={tablePlayers[1]} />
            )}
          </Box>

          <Box height="100%">
            <TableCoins coins={tableCoins} />
          </Box>
          
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            rowGap={'10px'}
            height="100%"
          >
            {/* 6TH PLAYER */}
            {tablePlayers.length === 6 && (
              <TablePlayer player={tablePlayers[5]} />
            )}

            {/* 5TH PLAYER */}
            {tablePlayers.length >= 5 && (
              <TablePlayer player={tablePlayers[4]} />
            )}
          </Box>
        </Box>

        <Box
          display="flex"
          flex={0.2}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {/* 1ST PLAYER, ALWAYS THE HERO PLAYER*/}
          {heroPlayer && <TablePlayer player={heroPlayer} />}
        </Box>
      </Box>
    </>
  );
};
