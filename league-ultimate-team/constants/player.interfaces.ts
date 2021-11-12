export interface IPlayerData {
  "Card Type": string;
  Carry: number;
  Experience: number;
  "Flag Link": string;
  "Headshot Link": string;
  Import: boolean;
  Laning: number;
  Nationality: string;
  Overall: number;
  Player: string;
  Position: string;
  Region: string;
  Team: string;
  "Team Logo Link": string;
  Threat: number;
  Versatility: number;
  Vision: number;
}

export enum RatingBreakpoints {
  LEGEND = 95,
  GOLD = 85,
  SILVER = 75,
  BRONZE,
}
