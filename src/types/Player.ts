import { Card } from "./Card";

export type Player = {
  name?: string;
  card1?: Card;
  card2?: Card;
  coins?: number;
  gamePosition?: number;
};

export const isEliminated = (player: Player) => {
  return (
    player.card1 &&
    player.card1.isRevealed &&
    player.card2 &&
    player.card2.isRevealed
  );
};

export const remainingCards = (player: Player): number => {
  let remainingCards = 0;
  if (!player.card1?.isRevealed) {
    remainingCards++;
  }
  if (!player.card2?.isRevealed) {
    remainingCards++;
  }

  return remainingCards;
};
