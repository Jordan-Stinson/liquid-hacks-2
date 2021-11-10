import { FC, ReactElement } from "react";
import { IPlayerData } from "../../constants/player.interfaces";
import {
  GoldBackground,
  SilverBackground,
  BronzeBackground,
  LegendBackground,
} from "../../public/images/card-backgrounds";
import classes from "./player-card.module.scss";

export interface PlayerCardProps {
  player: IPlayerData;
}

const PlayerCard: FC<PlayerCardProps> = ({ player }): ReactElement => {
  return <div className={classes.wrapper}></div>;
};

export default PlayerCard;
