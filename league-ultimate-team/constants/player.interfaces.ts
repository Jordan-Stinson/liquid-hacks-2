export interface IPlayerData {
  player: string;
  nationality: string;
  region: string;
  import: boolean;
  team: string;
  position: Roles;
  lan: number;
  vis: number;
  car: number;
  exp: number;
  ver: number;
  thr: number;
}

export enum Roles {
  TOP = "TOP",
  MID = "MID",
  JG = "JG",
  SUP = "SUP",
  ADC = "ADC",
}

export enum RatingBreakpoints {
  LEGEND = 95,
  GOLD = 85,
  SILVER = 75,
  BRONZE,
}
