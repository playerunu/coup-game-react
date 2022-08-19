export enum Influence {
  Duke,
  Captain,
  Assassin,
  Contessa,
  Ambassador,
}

export const influenceToStr = (influence: Influence): string => {
  return Influence[influence].toLowerCase();
};
