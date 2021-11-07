import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import router, { useRouter } from "next/router";
import WorldsBackground from "../../public/images/worlds-2021.jpg";
import LoLLogo from "../../public/images/lol-logo.png";
import classes from "./landing-page.module.scss";
import FakerCard from "../../public/images/playerCards/faker.png";
import { FC, ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import fs from "fs";

export interface LandingPageProps {
  playerImages: string[];
}

const LandingPage: FC<LandingPageProps> = ({ playerImages }): ReactElement => {
  const router = useRouter();
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const background = document.querySelector(
      "div[data-background]"
    ) as unknown as HTMLDivElement;
    window.addEventListener("scroll", function () {
      const pageOffset = window.scrollY / 500;
      background.style.background = `linear-gradient(rgba(255, 255, 255, ${pageOffset}), rgba(255, 255, 255, ${pageOffset}))`;
    });

    background.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
  }, []);

  const infoSection: ReactElement = (
    <div className={classes.infoContainer}>
      <div className={classes.infoTitle}>About Ultimate Team</div>
      <div className={classes.gameDescription}>
        <div className={classes.infoText}>
          <span>
            League of Legends: Ultimate Team is an interactive game that
            combines the team building of a fantasy league with the interactive
            gameplay of a "choose your own path" to create an exilirating
            experience for players.
          </span>
        </div>
        <div className={classes.infoText}>
          <span>
            Pick your team of 5 active pro players from across the world to face
            off against another custom team, where your interactive choices will
            help influence the outcome of the game!
          </span>
        </div>
        <div className={classes.infoText}>
          <span>
            By leveraging the Liquipedia API to get info about Pro players in
            the LCS, LEC, and LCK, each active Pro player is assigned stats
            based on several factors such as winrate, pickrate, and performance
            at both regional and international events. With over 150 active pro
            players in the database, there are over 24 million team combinations
            for you to discover, each with its own unique synergies!
          </span>
        </div>
        <div className={classes.infoText}>
          <span>
            Hop into a game now and see how you can do against our A.I. Look
            forward to our next update where we introduce the ability to play
            your team against another player's!
          </span>
        </div>
      </div>
    </div>
  );
  const homePageContent: ReactElement = (
    <div className={classes.topSection}>
      <Image src={LoLLogo} width={500} height={300} layout={"fixed"} />
      <div className={classes.gameName}>
        <span>Ultimate team</span>
      </div>
      {/* interesting idea is to show player cards fading in and out */}
      <div className={classes.playerCards}>
        {/* <Image src={FakerCard} width={150} height={200} layout={"fixed"} /> */}
        {playerImages.map((player, index) => {
          player = player.replaceAll("\\", "/").slice(7);
          return (
            <div className={classes.player} key={player + index}>
              <Image src={player} width={200} height={300} layout={"fixed"} />
            </div>
          );
        })}
      </div>

      <div className={classes.buttonsContainer}>
        <button onClick={() => router.push("/help")} className={classes.button}>
          <div className={classes.helpButton}>
            <span>How to play</span>
          </div>
        </button>
        <button onClick={() => router.push("/pick")} className={classes.button}>
          <div className={classes.playButton}>
            <span>Play now</span>
          </div>
        </button>
      </div>
      <div className={classes.infoSection}>{infoSection}</div>
    </div>
  );

  const HomePage = (
    <div className={classes.wrapper}>
      <div className={classes.pageContent}>{homePageContent}</div>
      <div className={classes.background}></div>
    </div>
  );

  return (
    <div className={classes.container}>
      <div className={classes.test} data-background>
        {HomePage}
      </div>
      {/* <Image
        className={classes.backgroundImage}
        src={WorldsBackground}
        layout={"fill"}
        objectFit={"cover"}
      /> */}
    </div>
  );
};

export default LandingPage;
