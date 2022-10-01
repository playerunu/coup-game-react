import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GameState } from './types';
import { GameMessage } from 'types/GameMessage';
import { Player } from 'types/Player';

const initialGameState: GameState = {
  heroPlayerName: '',
  players: [],
  remainingPlayers: 0,
  winner: undefined,
  currentPlayer: {},
  currentMove: undefined,
  tableCoins: 0,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    setHeroPlayerName: (state, action: PayloadAction<string>) => {
      state.heroPlayerName = action.payload;
    },
    updateStateFromWsMessage: (state, action: PayloadAction<any>) => {
      const message = action.payload.Data;
      const messageType = action.payload.MessageType;

      if (messageType === GameMessage[GameMessage.YourCards]) {
        // Extract the cards and convert the influence from string to enum
        const { card1, card2 } = message;
        // Lookup if the player already exists in game state
        let heroPlayer = state.players.find(
          (player) => player.name === state.heroPlayerName
        );
        if (heroPlayer) {
          heroPlayer.card1 = card1;
          heroPlayer.card2 = card2;
        } else {
          // Player does not exists, create it
          const newHeroPlayer: Player = {
            name: state.heroPlayerName,
            card1,
            card2,
          };
          state.players = [...state.players, newHeroPlayer];
        }
      } else {
        const newPlayersArray = [];
        if (!!message.players) {
          for (let player of message.players) {
            const gamePlayer = state.players.find(
              (p) => p.name === player.name
            );
            if (gamePlayer) {
              // If the player already exists, merge the update
              newPlayersArray.push({
                ...player,
                ...gamePlayer,
              });
            } else {
              // If the player does not exists, add the update obj to the array
              newPlayersArray.push(player);
            }
          }
        }

        return {
          ...state,
          currenMove: message?.currentMove ?? undefined,
          ...(!!message.remainingPlayers && {
            remainingPlayers: message.remainingPlayers,
          }),
          ...(!!message.winner && { winner: message.winner }),
          ...(!!message.currentPlayer && {
            currentPlayer: message.currentPlayer,
          }),
          ...(!!message.currentMove && { currentMove: message.currentMove }),
          ...(!!message.tableCoins && { tableCoins: message.tableCoins }),
          ...(!!message.players && { players: [...newPlayersArray] }),
        };
      }
    },
  },
});

export const selectHeroPlayerName = (state: RootState) => {
  return state.game.heroPlayerName;
};

export const selectPlayers = (state: RootState) => {
  return state.game.players;
};

export const { setHeroPlayerName, updateStateFromWsMessage } =
  gameSlice.actions;

export const gameReducer = gameSlice.reducer;
