import { Player } from "./Player";
import { PlayerMove } from "./PlayerMove";

export type Game = {
  players: Player[];
  remainingPlayers: number;
  winner?: Player;
  currentPlayer: Player;
  currentMove?: PlayerMove;
  tableCoins: number;
};
