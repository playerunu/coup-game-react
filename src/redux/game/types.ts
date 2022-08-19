import { Player } from "types/Player";
import { PlayerMove } from "types/PlayerMove";

export type GameState = {
  players: Player[];
  remainingPlayers: number;
  winner?: Player;
  currentPlayer: Player;
  currentMove?: PlayerMove;
  tableCoins: number;
};
