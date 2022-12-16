import { Player } from 'types/Player';
import { PlayerMove } from 'types/PlayerMove';
import { GameMessage } from 'types/GameMessage';

export type GameState = {
  heroPlayerName: string;
  players: Player[];
  remainingPlayers: number;
  winner?: Player;
  currentPlayer: Player;
  currentMove?: PlayerMove;
  tableCoins: number;
  gameStarted: boolean;
  pendingHeroPlayerMove?: PlayerMove;
};

export type WsMessage = {
  MessageType: GameMessage;
  Data: any;
};
