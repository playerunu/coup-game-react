import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GameState } from './types';
import { GameMessage } from 'types/GameMessage';
import { Player } from 'types/Player';
import { ActionType } from 'types/Action';
import { influenceToStr } from 'types/Influence';
import { challengeToStr } from 'types/Challenge';
import { playerMoveToStr } from 'types/PlayerMove';

const initialGameState: GameState = {
  heroPlayerName: '',
  players: [],
  remainingPlayers: 0,
  winner: undefined,
  currentPlayer: {},
  currentMove: undefined,
  tableCoins: 0,
  gameStarted: false,
  pendingHeroPlayerMove: undefined,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    setHeroPlayerName: (state, action: PayloadAction<string>) => {
      state.heroPlayerName = action.payload;
    },
    setPendingHeroPlayerMove: (state, action: PayloadAction<ActionType>) => {
      state.pendingHeroPlayerMove = {
        action: {
          actionType: action.payload,
        },
      };
    },
    cancelPendingHeroPlayerMove: (state) => {
      state.pendingHeroPlayerMove = undefined;
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
        const newPlayersArray: Player[] = [];
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
          ...(messageType === GameMessage[GameMessage.GameStarted] && {
            gameStarted: true,
          }),
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

export const selectTableCoins = (state: RootState) => {
  return state.game.tableCoins;
};

export const selectGameStarted = (state: RootState) => {
  return state.game.gameStarted;
};

export const selectIsHeroPlayerTurn = (state: RootState) => {
  return state.game.currentPlayer?.name === state.game.heroPlayerName;
};

export const selectCurrentActionText = (state: RootState): string => {
  const currentPlayerName = state.game.currentPlayer.name;
  const currentMove = state.game.currentMove;
  const vsPlayerName = state.game.currentMove?.vsPlayer?.name;

  if (state.game.winner) {
    return `${state.game.winner.name} won the game! GG WP NO RE!`;
  }

  if (state.game.pendingHeroPlayerMove) {
    switch (state.game.pendingHeroPlayerMove.action.actionType) {
      case ActionType.TakeOneCoin:
        return 'Confirm taking 1 coin';
      case ActionType.TakeTwoCoins:
        return 'Confirm taking 2 coins';
      case ActionType.TakeThreeCoins:
        return 'Confirm taking 3 coins';
      case ActionType.Steal:
        return `Steal from ${state.game.pendingHeroPlayerMove.vsPlayer?.name}`;
      case ActionType.Assassinate:
        return `Assassinate ${state.game.pendingHeroPlayerMove.vsPlayer?.name}`;
      case ActionType.Coup:
        return `Launch a Coup against ${state.game.pendingHeroPlayerMove.vsPlayer?.name}`;
      case ActionType.Exchange:
        return 'Exchange cards';
    }
  }

  // if (this.pendingCounter) {
  //   switch (this.pendingCounter.messageType) {
  //     case GameMessage[GameMessage.BlockAction]:
  //       return `Block with ${influenceToStr(
  //         this.pendingCounter.pretendingInfluence
  //       )}`;
  //     case GameMessage[GameMessage.CurrentActionChallenge]:
  //     case GameMessage[GameMessage.ChallengeBlock]:
  //       return 'Challenge';
  //   }
  // }

  if (currentMove && currentPlayerName) {
    // Blocked
    if (currentMove.block) {
      const block = currentMove.block;
      if (block.challenge && block.player?.name) {
        // Someone challenged the block
        const challengedActionStr = `${
          block.player.name
        } blocks with ${influenceToStr(block.pretendingInfluence)}`;
        return challengeToStr(
          block.challenge,
          block.player.name,
          challengedActionStr
        );
      } else {
        return `${block.player.name} blocks with ${influenceToStr(
          block.pretendingInfluence
        )}`;
      }
    }

    // Challenged
    if (currentMove.challenge && currentPlayerName) {
      return `${challengeToStr(
        currentMove.challenge,
        currentPlayerName,
        playerMoveToStr(currentMove, currentPlayerName)
      )}`;
    }

    if (currentMove.finished) {
      // Waiting assassination reveal (waiting challenge is handled above already)
      if (currentMove.waitingReveal) {
        if (currentMove.action.actionType === ActionType.Assassinate) {
          // Waiting assassination reveal
          return `${vsPlayerName} was assassinated by ${currentPlayerName}. Waiting for ${vsPlayerName} to reveal a card.`;
        } else {
          // Waiting coup reveal
          return `${currentPlayerName} launched a coup against ${vsPlayerName}. Waiting for ${vsPlayerName} to reveal a card.`;
        }
        // Waiting challenge is already handled above
      }

      // Waiting exchange
      if (currentMove.waitingExchange) {
        return `Waiting for ${currentPlayerName} to exchange cards.`;
      }
    }

    return playerMoveToStr(currentMove, currentPlayerName);
  }

  return state.game.currentPlayer.name + "'s turn";
};

export const {
  setHeroPlayerName,
  cancelPendingHeroPlayerMove,
  setPendingHeroPlayerMove,
  updateStateFromWsMessage,
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
