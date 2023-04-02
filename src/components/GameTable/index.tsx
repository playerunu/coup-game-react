import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
//import useScreenOrientation from "hooks/useScreenOrientation";
import { useAppSelector } from 'redux/hooks';
import {
  selectHeroPlayerName,
  selectPlayers,
  selectTableCoins,
} from 'redux/game/slice';
import { Player } from 'types/Player';
import { TablePlayer } from 'components/TablePlayer';
import { TableCoins } from 'components/TableCoins';
import { TableCards } from 'components/TableCards';
import { useWindowSize } from 'hooks/useWindowSize';
import { CustomDragLayer } from 'components/CustomDragLayer';
import { NoiseBackground } from 'components/NoiseBackground';
import { CurrentActionDescription } from 'components/CurrentActionDescription';
import { ConfirmActionPanel } from 'components/ConfirmActionPanel';

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
        setHeroPlayer({ ...hero, coins: 12 });

        if (players.length > 1 && hero?.gamePosition !== undefined) {
          let sortedPlayers: Player[] = [];
          for (
            let tableIndex = 0, gameIndex = hero.gamePosition;
            tableIndex < players.length;
            tableIndex++, gameIndex = (gameIndex + 1) % players.length
          ) {
            let player = players.find((p) => p.gamePosition === gameIndex);
            if (player) {
              sortedPlayers.push({ ...player, coins: 12 } as Player);
            }
          }
          setTablePlayers([
            ...sortedPlayers,
            sortedPlayers[1],
            sortedPlayers[1],
            sortedPlayers[1],
            sortedPlayers[1],
          ]);
        }
      }
    }
  }, [players, heroPlayerName]);

  return (
    <>
      <CustomDragLayer />
      <NoiseBackground />

      <Stack height={windowHeight} width="100vw">
        <Stack alignItems={'center'} 
          flex="0.07 0.07 7%"
          >
          <CurrentActionDescription />
        </Stack>
        <Box
          display="flex"
          flex="0.1 0.1 10%"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {/* 4TH PLAYER */}
          {tablePlayers.length >= 4 && <TablePlayer player={tablePlayers[3]} />}
        </Box>

        <Box
          display="flex"
          flex="0.2 0.2 20%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack justifyContent="center" rowGap={'10px'} height="100%">
            {/* 3RD PLAYER */}
            {tablePlayers.length >= 3 && (
              <TablePlayer player={tablePlayers[2]} />
            )}

            {/* 2ND PLAYER */}
            {tablePlayers.length >= 2 && (
              <TablePlayer player={tablePlayers[1]} />
            )}
          </Stack>

          <Stack justifyContent="center" rowGap={'10px'} height="100%">
            {/* 6TH PLAYER */}
            {tablePlayers.length === 6 && (
              <TablePlayer player={tablePlayers[5]} showCoinsOnLeft={true} />
            )}

            {/* 5TH PLAYER */}
            {tablePlayers.length >= 5 && (
              <TablePlayer player={tablePlayers[4]} showCoinsOnLeft={true} />
            )}
          </Stack>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          columnGap="40px"
          flex="0.15 0.15 15%"
        >
          <TableCoins totalCoins={tableCoins} />
          <TableCards totalCards={15 - players.length * 2} />
        </Box>

        <Box
          display="flex"
          flex="0.1 0.1 10%"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {/* 1ST PLAYER, ALWAYS THE HERO PLAYER*/}
          {heroPlayer && <TablePlayer player={heroPlayer} />}
        </Box>
        
        <Box
          display="flex"
          flex="0.1 0.1 10%"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {/* 1ST PLAYER, ALWAYS THE HERO PLAYER*/}
          <ConfirmActionPanel/>
        </Box>
        
      </Stack>
    </>
  );
};
