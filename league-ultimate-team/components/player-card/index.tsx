import { FC, ReactElement } from "react";
import {
  IPlayerData,
  RatingBreakpoints,
} from "../../constants/player.interfaces";
import {
  SilverBackground,
  BronzeBackground,
  LegendBackground,
  GoldBackground,
} from "../../public/images/card-backgrounds";
import classes from "./player-card.module.scss";
import Image from "next/image";

export interface PlayerCardProps {
  player: IPlayerData;
}

const PlayerCard: FC<PlayerCardProps> = ({ player }): ReactElement => {
  const playerRating: number = Math.round(
    (player.car +
      player.exp +
      player.vis +
      player.lan +
      player.thr +
      player.ver) /
      6
  );

  const ratingBreakpoint =
    playerRating >= 95
      ? RatingBreakpoints.LEGEND
      : playerRating >= 85
      ? RatingBreakpoints.GOLD
      : playerRating >= 75
      ? RatingBreakpoints.SILVER
      : RatingBreakpoints.BRONZE;

  const cardBackground = (playerRating: RatingBreakpoints): ReactElement => {
    switch (playerRating) {
      case RatingBreakpoints.LEGEND:
        return (
          <Image
            src={LegendBackground}
            alt="background"
            width={230}
            height={320}
          />
        );
      case RatingBreakpoints.GOLD:
        return (
          <Image
            src={GoldBackground}
            alt="background"
            width={230}
            height={320}
          />
        );
      case RatingBreakpoints.SILVER:
        return (
          <Image
            src={SilverBackground}
            alt="background"
            width={230}
            height={320}
          />
        );
      default:
        return (
          <Image
            src={BronzeBackground}
            alt="background"
            width={230}
            height={320}
          />
        );
    }
  };

  const playerHeadshot = (playerName: string) => {
    const pname = playerName.split(" ").join("_");
    const player = require(`../../public/images/playerImages/${pname}.png`);
    return <Image src={player} alt="player" width={170} height={130} />;
  };

  const rightBanner = (
    rating: number,
    position: string,
    nationality: string,
    team: string
  ) => {
    const teamName = team.split(" ").join("_");
    const flag = require(`../../public/images/countryFlags/${nationality}.png`);
    const teamLogo = require(`../../public/images/team-logos/${teamName}.png`);
    return (
      <div className={classes.bannerContainer}>
        <div className={classes.rating}>
          <span>{rating}</span>
        </div>
        <div className={classes.position}>
          <span>{position}</span>
        </div>
        <div className={classes.nationality}>
          <Image src={flag} alt="nationality" width={35} height={25} />
        </div>
        <div className={classes.team}>
          <Image src={teamLogo} alt="team" width={50} height={50} />
        </div>
      </div>
    );
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.background}>
        {cardBackground(ratingBreakpoint)}
      </div>
      <div className={classes.playerHeadshot}>
        {playerHeadshot(player.player)}
      </div>
      <div className={classes.banner}>
        {rightBanner(
          playerRating,
          player.position,
          player.nationality,
          player.team
        )}
      </div>
      <div className={classes.playerStats}>
        <div className={classes.playerName}>
          <span>{player.player}</span>
        </div>
        <div className={classes.stats}>
          <div className={classes.leftStats}>
            <div className={classes.stat}>
              <div className={classes.statNumber}>
                <span>{player.thr}</span>
              </div>
              <div className={classes.statName}>
                <span>THR</span>
              </div>
            </div>
            <div className={classes.stat}>
              <div className={classes.statNumber}>
                <span>{player.exp}</span>
              </div>
              <div className={classes.statName}>
                <span>EXP</span>
              </div>
            </div>
            <div className={classes.stat}>
              <div className={classes.statNumber}>
                <span>{player.ver}</span>
              </div>
              <div className={classes.statName}>
                <span>VER</span>
              </div>
            </div>
          </div>
          <div className={classes.rightStats}>
            <div className={classes.stat}>
              <div className={classes.statNumber}>
                <span>{player.vis}</span>
              </div>
              <div className={classes.statName}>
                <span>VIS</span>
              </div>
            </div>
            <div className={classes.stat}>
              <div className={classes.statNumber}>
                <span>{player.car}</span>
              </div>
              <div className={classes.statName}>
                <span>CAR</span>
              </div>
            </div>
            <div className={classes.stat}>
              <div className={classes.statNumber}>
                <span>{player.lan}</span>
              </div>
              <div className={classes.statName}>
                <span>LAN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
