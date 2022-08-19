import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GameState } from './types';

const initialGameState: GameState = {
    players: [],
    remainingPlayers: 0,
    currentPlayer: {},
    currentMove: undefined,
    tableCoins: 0,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    // logout: (state) => {
    //   state.isAuthenticated = false;
    // },
    // setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
    //   state.isAuthenticated = action.payload;
    // },
  },
});

// export const { logout, setIsAuthenticated } = gameSlice.actions;

// export const selectIsAuthenticated = (state: RootState) => {
//   return state.auth.isAuthenticated;
// };

export const gameReducer = gameSlice.reducer;
